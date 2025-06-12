// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { PostService } from "../services/blog.service";
import { sendEmail } from "../utils/email";
import { AuthenticatedRequest } from "../types/common.types";

const postService = new PostService();

// --- CREATE POST (Corrected) ---
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const user = req.user!;

    if (!req.file) {
      console.error("Validation failed in controller: req.file is missing.");
      res.status(400).json({
        status: "error",
        Code: 400,
        message: "A hero image is required for the post.",
      });
      return; // A simple return here is fine to exit the function, or just let the `if` block end.
    }

    const imageUrl = req.file.path;
    const post = await postService.createPost(title, content, user, imageUrl);
    
    await sendEmail(user.email, "New Post Created", `Your post "${title}" has been created.`);

    // No `return` keyword needed here either.
    res.status(201).json({
      status: "success",
      Code: 201,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    // This is for unhandled errors. It's better to use `next(error)`
    // if you have an error handling middleware.
    res.status(500).json({
      status: "error",
      Code: 500,
      message: "Failed to create post",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// --- GET ALL POSTS (Corrected) ---
export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const { posts, total } = await postService.getAllPosts(page, limit);
    
    
    res.status(200).json({
      status: "success",
      Code: 200,
      message: "Posts retrieved successfully",
      data: {
        posts: posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          created_at: post.created_at, // <-- SEND THE RAW DATE OBJECT
          author: {
            id: post.author.id,
            username: post.author.username,
          }
        }))
      },
      meta: { total, page, limit }
    });
  } catch (error) {
    // ... your error handling ...
  }
};
// --- UPDATE POST (Corrected) ---
// Changed the return type to Promise<void> for clarity.
export async function updatePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const updateData = req.body;
    const user = req.user!;

    const existingPost = await postService.getPostById(postId);
    if (!existingPost) {
      res.status(404).json({ status: "error", Code: 404, message: "Post not found" });
      return; // Exit after sending response
    }

    if (existingPost.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ status: "error", Code: 403, message: "Unauthorized to update this post" });
      return; // Exit after sending response
    }

    if (req.file) {
      updateData.imageUrl = req.file.path;
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
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

// --- ALL OTHER FUNCTIONS CORRECTED TO NOT RETURN `res.json()` ---

export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ status: "error", Code: 404, message: "Post not found" });
      return;
    }
    res.status(200).json({ status: "success", Code: 200, data: post });
  } catch (error) {
    res.status(500).json({ status: "error", Code: 500, message: "Failed to get post", error });
  }
}

export async function deletePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const user = req.user!;
    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ status: "error", Code: 404, message: "Post not found" });
      return;
    }
    if (post.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ status: "error", Code: 403, message: "Unauthorized to delete this post" });
      return;
    }
    await postService.deletePost(postId, user);
    res.status(200).json({ status: "success", Code: 200, message: `Post ${postId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ status: "error", Code: 500, message: "Failed to delete post", error });
  }
}

export async function inactivatePost(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const postId = parseInt(req.params.id);
    const user = req.user!;
    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ status: "error", Code: 404, message: "Post not found" });
      return;
    }
    if (post.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ status: "error", Code: 403, message: "Unauthorized to deactivate this post" });
      return;
    }
    await postService.activatePost(postId, user);
    res.status(200).json({ status: "success", Code: 200, message: `Post ${postId} status updated` });
  } catch (error) {
    res.status(500).json({ status: "error", Code: 500, message: "Failed to update post status", error });
  }
}