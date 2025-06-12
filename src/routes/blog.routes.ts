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
import upload from "../middleware/upload"; // Make sure this is imported
import { createPostSchema, updatePostSchema } from "../schemas/blog.schemas";

const router = Router();

// --- PUBLIC ROUTES ---
router.get("/get", getPosts); // Matching your path `/posts/get`
router.get("/:id", getPostById);

// --- PROTECTED ROUTES WITH CORRECT MIDDLEWARE ORDER ---

// Route for POST /posts/add
router.post(
  "/add",
  authenticated, // 1. First, check if the user is logged in.
  upload.single("image"), // 2. SECOND, process the file upload. This populates `req.file` and `req.body`.
  validate(createPostSchema), // 3. THIRD, validate the `req.body` which now has data.
  createPost // 4. Finally, run the controller logic.
);

// Route for PUT /posts/:id
router.put(
  "/:id",
  authenticated,
  upload.single("image"), // Also handle optional file uploads for updates.
  validate(updatePostSchema),
  updatePost
);

// Delete route doesn't need upload middleware.
router.delete("/:id", authenticated, deletePost);

export default router;
