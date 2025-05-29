// src/routes/post.routes.ts
import { Router } from "express";
import { authenticated } from "../middleware/auth.middleware";
import { createPost, deletePost, getPosts, updatePost, getPostById } from "../controllers/blog.controller";
import { createPostSchema, updatePostSchema } from "../schemas/blog.schemas";
import { validate } from "../middleware/validation.middleware";

const router = Router();

router.post("/add", authenticated,validate(createPostSchema), createPost);
router.get("/get", getPosts);
router.get("/get/:id", getPostById);
router.put("/:id", authenticated,validate(updatePostSchema), updatePost);
router.delete("/delete/:id", authenticated, deletePost);


export default router;
