import { AppDataSource } from "../config/database";
import { Recipe } from "../modals/Recipe";
import { User } from "../modals/user";
import { NotFoundError } from "../utils/errors";
import { CreateRecipeInput, UpdateRecipeInput } from "../schemas/recipe.schemas";

export class RecipeService {
  private recipeRepository = AppDataSource.getRepository(Recipe);
  private userRepository = AppDataSource.getRepository(User);

  // CREATE a new recipe (No changes here)
  async create(input: CreateRecipeInput, authorId: number): Promise<Recipe> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundError("Author not found");
    }
    const newRecipe = this.recipeRepository.create({
      ...input,
      author: author,
    });
    return this.recipeRepository.save(newRecipe);
  }

  // READ all recipes (No changes here)
  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({ relations: ["author"] });
  }

  // READ a single recipe by its ID (No changes here)
  async findById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({ where: { id }, relations: ["author"] });
  }

  // --- ✅ THIS IS THE FIX ---
  // UPDATE a recipe
  async update(id: number, input: UpdateRecipeInput): Promise<Recipe> {
    const recipe = await this.findById(id);
    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    // Instead of just merging, we will be more explicit.
    // First, update the simple string properties.
    recipe.title = input.title ?? recipe.title;
    recipe.cookTime = input.cookTime ?? recipe.cookTime;
    recipe.imageUrl = input.imageUrl ?? recipe.imageUrl;

    // Then, explicitly replace the arrays if they exist in the input.
    if (input.ingredients) {
      recipe.ingredients = input.ingredients;
    }
    if (input.instructions) {
      recipe.instructions = input.instructions;
    }

    // Now, save the fully updated recipe object.
    return this.recipeRepository.save(recipe);
  }

  // DELETE a recipe (No changes here)
  async delete(id: number): Promise<boolean> {
    const result = await this.recipeRepository.delete(id);
    return result.affected !== 0;
  }
}