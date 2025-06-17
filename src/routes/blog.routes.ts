import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/blog.controller";
import { authenticated } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import upload from "../middleware/upload"; 
import { createPostSchema, updatePostSchema } from "../schemas/blog.schemas";


const router = Router();


router.get("/get", getPosts); 
router.get("/:id", getPostById);


router.post(
  "/add",
  authenticated,
  upload.single("image"), 
  // validate(createPostSchema), 
  createPost 
);


router.put(
  "/:id",
  authenticated,
  upload.single("image"), 
  updatePost
);


router.delete("/:id", authenticated, deletePost);


export default router;
