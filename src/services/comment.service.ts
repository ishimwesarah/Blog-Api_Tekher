// comment.service.ts - Updated to return comments with author info
import { AppDataSource } from "../config/database";
import { Comment } from "../modals/Comment";
import { User } from "../modals/user";
import { Recipe } from "../modals/Recipe";
import { NotFoundError } from "../utils/errors";

export class CommentService {
  private commentRepository = AppDataSource.getRepository(Comment);
  private userRepository = AppDataSource.getRepository(User);
  private recipeRepository = AppDataSource.getRepository(Recipe);

  // Find a single comment by its ID, and include its author's info
  async findById(id: number): Promise<Comment | null> {
    return this.commentRepository.findOne({ 
      where: { id }, 
      relations: ["author"] 
    });
  }

  // Create a new comment on a recipe
  async create(text: string, authorId: number, recipeId: number): Promise<Comment> {
    const author = await this.userRepository.findOneBy({ id: authorId });
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });

    if (!author || !recipe) {
      throw new NotFoundError("Author or Recipe not found");
    }

    const newComment = this.commentRepository.create({ text, author, recipe });
    const savedComment = await this.commentRepository.save(newComment);
    
    // Return the comment with author information
    return this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ["author"]
    }) as Promise<Comment>;
  }

  // Update an existing comment
  async update(id: number, text: string): Promise<Comment> {
    const comment = await this.findById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    comment.text = text;
    const updatedComment = await this.commentRepository.save(comment);
    
    // Return the updated comment with author information
    return this.commentRepository.findOne({
      where: { id: updatedComment.id },
      relations: ["author"]
    }) as Promise<Comment>;
  }

  // Delete a comment
  async delete(id: number): Promise<boolean> {
    const result = await this.commentRepository.delete(id);
    return result.affected !== 0;
  }
}