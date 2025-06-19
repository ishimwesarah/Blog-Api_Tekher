// recipe.service.ts - Updated with proper relations loading
import { AppDataSource } from "../config/database";
import { Recipe } from "../modals/Recipe";
import { User } from "../modals/user";
import { NotFoundError } from "../utils/errors";
import { CreateRecipeInput, UpdateRecipeInput } from "../schemas/recipe.schemas";

export class RecipeService {
  private recipeRepository = AppDataSource.getRepository(Recipe);
  private userRepository = AppDataSource.getRepository(User);

  // CREATE a new recipe
  async create(input: CreateRecipeInput, authorId: number): Promise<Recipe> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundError("Author not found");
    }
    const newRecipe = this.recipeRepository.create({
      ...input,
      author: author,
    });
    const savedRecipe = await this.recipeRepository.save(newRecipe);
    
    // Return with all relations loaded
    return this.findById(savedRecipe.id) as Promise<Recipe>;
  }

  // READ all recipes with comments and likes
  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({ 
      relations: [
        "author", 
        "likes", 
        "likes.user", 
        "comments", 
        "comments.author"
      ],
      order: {
        created_at: "DESC",
        comments: {
          created_at: "ASC"
        }
      }
    });
  }

  // READ a single recipe by its ID with all relations
  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({ 
      where: { id }, 
      relations: [
        "author", 
        "likes", 
        "likes.user", 
        "comments", 
        "comments.author"
      ],
      order: {
        comments: {
          created_at: "ASC"
        }
      }
    });
  }

  // UPDATE a recipe
  async update(id: number, input: UpdateRecipeInput): Promise<Recipe> {
    const recipe = await this.findById(id);
    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    // Update the properties
    recipe.title = input.title ?? recipe.title;
    recipe.cookTime = input.cookTime ?? recipe.cookTime;
    recipe.imageUrl = input.imageUrl ?? recipe.imageUrl;

    // Replace the arrays if they exist in the input
    if (input.ingredients) {
      recipe.ingredients = input.ingredients;
    }
    if (input.instructions) {
      recipe.instructions = input.instructions;
    }

    // Save and return with all relations
    await this.recipeRepository.save(recipe);
    return this.findById(id) as Promise<Recipe>;
  }

  // DELETE a recipe
  async delete(id: number): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return result.affected !== 0;
  }
}