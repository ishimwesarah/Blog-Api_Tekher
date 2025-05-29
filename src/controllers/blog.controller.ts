// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { PostService } from "../services/blog.service";
import { sendEmail } from "../utils/email";
import { AuthenticatedRequest } from "../types/common.types";

const postService = new PostService();



export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const user = req.user!;

    const post = await postService.createPost(title, content, user);
    await sendEmail(user.email, "New Post Created", `Your post "${title}" has been created.`);

    res.status(201).json({
      status: "success",
      Code: 201,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to create post",
      error,
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
   const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10; ;
  try {
    const { posts, total }  = await postService.getAllPosts(page, limit);
    res.status(200).json({
  status: "success",
  Code: 200,
  message: "Posts retrieved successfully",
  data: {
    post: posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        username: post.author.username,
      }
    }))
  },
  meta: {
    total: total,   
    page: page,      
    limit: limit,    
  }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to retrieve posts",
      error,
    });
  }
};

export async function updatePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const updateData = req.body;
    const user = req.user!;

    const existingPost = await postService.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({ 
        status: "error", 
        Code: 404, 
        message: "Post not found" });
      return;
    }

    if (existingPost.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ 
        status: "error", 
        Code: 403, 
        message: "Unauthorized to update this post" });
      return;
    }

    const updatedPost = await postService.updatePost(postId, updateData, user);
    res.status(200).json({
      status: "success",
      Code: 200,
      message: `Post ${postId} updated successfully`,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to update post",
      error,
    });
  }
}

export async function deletePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const user = req.user!;

    const existingPost = await postService.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({ 
        status: "error", 
        Code: 404, 
        message: "Post not found" });
      return;
    }

    if (existingPost.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ 
        status: "error", 
        Code: 403, 
        message: "Unauthorized to delete this post" });
      return;
    }

    await postService.deletePost(postId, user);
    res.status(200).json({
      status: "success",
      Code: 200,
      message: `Post ${postId} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to delete post",
      error,
    });
  }
}

export async function inactivatePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const user = req.user!;

    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ 
        status: "error", 
        Code: 404, 
        message: "Post not found" });
      return;
    }

    if (post.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ 
        status: "error", 
        Code: 403, 
        message: "Unauthorized to deactivate this post" });
      return;
    }

    // Assuming activatePost is a method that deactivates the post
    await postService.activatePost(postId, user);
    res.status(200).json({
      status: "success",
      Code: 200,
      message: `Post ${postId} deactivated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to deactivate post",
      error,
    });
  }
}

export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);

    const existingPost = await postService.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({
        status: "error",
        Code: 404,
        message: "Post not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      Code: 200,
      data: existingPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to get post",
      error,
    });
  }
}



