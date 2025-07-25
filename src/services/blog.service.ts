// src/services/blog.service.ts
import { AppDataSource } from "../config/database"; // Ensure this path is correct
import { Post } from "../modals/blog";
import { User } from "../modals/user";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export class PostService {
  activatePost(postId: number, user: User) {
    
    throw new Error("Method not implemented.");
  }
  private postRepo = AppDataSource.getRepository(Post);

 
  async createPost(title: string, content: object[], author: User, imageUrl: string) {
    
    const post = this.postRepo.create({ 
        title, 
        content, 
        author, 
        imageUrl 
    });
    return await this.postRepo.save(post);
  }

  async getAllPosts(page: number, limit: number) {
    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author'],
      order: { created_at: 'DESC' }, 
      skip: (page - 1) * limit,
      take: limit,
    });
    return { posts, total };
  }

  async getPostById(id: number) {
    return await this.postRepo.findOne({ where: { id }, relations: ['author'] });
  }

  async updatePost(id: number, data: Partial<Post>, user: User): Promise<Post> {
    
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }

    // 2. Permission Check.
    if (post.author.id !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
      throw new ForbiddenError("You are not authorized to update this post");
    }

    // 3. --- EXPLICITLY ASSIGN EACH PROPERTY ---
    // This is more reliable than Object.assign or repository.merge for complex types.
    
    // If the incoming data has a new title, update it.
    if (data.title) {
      post.title = data.title;
    }

    // If the incoming data has a new hero image URL, update it.
    if (data.imageUrl) {
      post.imageUrl = data.imageUrl;
    }

    // If the incoming data has new content (the JSON array), update it.
    if (data.content) {
      post.content = data.content;
    }
    
    // 4. Save the fully updated post object back to the database.
    return await this.postRepo.save(post);
  }

  
  async deletePost(id: number, user: User) {
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    if (post.author.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenError("You are not authorized to delete this post");
    }
    
    
    return await this.postRepo.remove(post);
  }
  
  
}