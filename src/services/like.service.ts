import { AppDataSource } from "../config/database";
import { Like } from "../modals/Like";
import { User } from "../modals/user";
import { Recipe } from "../modals/Recipe";
import { NotFoundError } from "../utils/errors";

export class LikeService {
  private likeRepository = AppDataSource.getRepository(Like);
  private userRepository = AppDataSource.getRepository(User);
  private recipeRepository = AppDataSource.getRepository(Recipe);

  // This single function handles both liking and unliking.
  async toggleLike(userId: number, recipeId: number): Promise<{ liked: boolean }> {
    // 1. Find the user and the recipe to make sure they exist.
    const user = await this.userRepository.findOneBy({ id: userId });
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });

    if (!user || !recipe) {
      throw new NotFoundError("User or Recipe not found");
    }

    // 2. Check if this user has already liked this specific recipe.
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        recipe: { id: recipeId },
      },
    });

    if (existingLike) {
      // 3. If a like exists, we delete it (unlike).
      await this.likeRepository.remove(existingLike);
      return { liked: false }; // Let the front-end know the new state is "not liked".
    } else {
      // 4. If no like exists, we create a new one.
      const newLike = this.likeRepository.create({
        user: user,
        recipe: recipe,
      });
      await this.likeRepository.save(newLike);
      return { liked: true }; // Let the front-end know the new state is "liked".
    }
  }
}