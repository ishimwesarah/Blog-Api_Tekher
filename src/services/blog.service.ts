// src/services/post.service.ts
import { AppDataSource } from "../config/database";
import { Post } from "../modals/blog";
import { User } from "../modals/user";

export class PostService {
  private postRepo = AppDataSource.getRepository(Post);

  async createPost(title: string, content: string, author: User) {
    const post = this.postRepo.create({ title, content, author });
    return await this.postRepo.save(post);
  }

  async getAllPosts() {
    return await this.postRepo.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    return await this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async updatePost(id: number, data: Partial<Post>, user: User) {
    const post = await this.getPostById(id);
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
