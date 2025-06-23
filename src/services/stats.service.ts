import { AppDataSource } from "../config/database";
import { User } from "../modals/user";
import { Post } from "../modals/blog";
import { Recipe } from "../modals/Recipe";
import { Like } from "../modals/Like";
import { Comment } from "../modals/Comment";

export class StatsService {
  async getDashboardStats(): Promise<object> {
    // We can run all these database count queries in parallel for efficiency
    const [
      userCount,
      postCount,
      recipeCount,
      likeCount,
      commentCount
    ] = await Promise.all([
      AppDataSource.getRepository(User).count(),
      AppDataSource.getRepository(Post).count(),
      AppDataSource.getRepository(Recipe).count(),
      AppDataSource.getRepository(Like).count(),
      AppDataSource.getRepository(Comment).count(),
    ]);

    return {
      users: { total: userCount },
      posts: { total: postCount },
      recipes: { total: recipeCount },
      interactions: {
        likes: likeCount,
        comments: commentCount,
      },
    };
  }
}