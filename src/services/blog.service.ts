// src/services/blog.service.ts
import { AppDataSource } from "../config/database"; // Ensure this path is correct
import { Post } from "../modals/blog";
import { User } from "../modals/user";

export class PostService {
  activatePost(postId: number, user: User) {
    // This method is not implemented, which is fine for now.
    throw new Error("Method not implemented.");
  }
  private postRepo = AppDataSource.getRepository(Post);

  // --- ✅ THIS IS THE FIX ---
  async createPost(title: string, content: string, author: User, imageUrl: string) {
    // Add `imageUrl` to the object being created.
    const post = this.postRepo.create({ 
        title, 
        content, 
        author, 
        imageUrl // <-- The missing ingredient!
    });
    return await this.postRepo.save(post);
  }

  async getAllPosts(page: number, limit: number) {
    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author'],
      order: { created_at: 'DESC' }, // Order by newest first, a nice touch!
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  }

  async getPostById(id: number) {
    return await this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async updatePost(id: number, data: Partial<Post>, user: User) {
    const post = await this.getPostById(id);
    // These permission checks are good!
    if (!post) return null;
    if (post.author.id !== user.id && user.role !== 'admin') return null;

    Object.assign(post, data);
    return await this.postRepo.save(post);
  }

  async deletePost(id: number, user: User) {
    const post = await this.getPostById(id);
    if (!post) return null;
    if (post.author.id !== user.id && user.role !== 'admin') return null;

    return await this.postRepo.remove(post);
  }
}