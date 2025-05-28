// src/routes/post.routes.ts
import { Router } from "express";
import { authenticated } from "../middleware/auth.middleware";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/blog.controller";

const router = Router();

router.post("/add", authenticated, createPost);
router.get("/", getPosts);
router.put("/:id", authenticated, updatePost);
router.delete("/:id", authenticated, deletePost);

export default router;
