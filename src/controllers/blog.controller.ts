// src/controllers/post.controller.ts
import { Request, Response } from "express";
import { PostService } from "../services/blog.service";
import { sendEmail } from "../utils/email";
import { AuthenticatedRequest } from "../types/common.types";

const postService = new PostService();

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;
  const user = req.user!;

  const post = await postService.createPost(title, content, user);

  // Send email to author
  await sendEmail(user.email, "New Post Created", `Your post "${title}" has been created.`);

  res.status(201).json({ success: true, data: post });
};

export const getPosts = async (_: Request, res: Response) => {
  const posts = await postService.getAllPosts();
  res.status(200).json({ success: true, data: posts });
};

export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const postId = req.params.id;
    const updateData = req.body;

    // Your update logic here, e.g.:
    // await PostRepository.update(postId, updateData);

    res.status(200).json({ message: `Post ${postId} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
}

// Delete a blog post
export async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const postId = req.params.id;

    // Your delete logic here, e.g.:
    // await PostRepository.delete(postId);

    res.status(200).json({ message: `Post ${postId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
}
