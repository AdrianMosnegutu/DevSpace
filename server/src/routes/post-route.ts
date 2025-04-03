import { Router } from "express";
import {
  removeLike,
  addPost,
  deletePost,
  getAllPosts,
  getPost,
  getPostsOrderedByDate,
  getPostsOrderedByLikes,
  getPostsWithTags,
  postIdParam,
  updatePost,
  addLike,
} from "../controllers/post-controller";
import {
  validatePost,
  validatePostQueryTags,
} from "../middleware/validate-post";
import validateDescending from "../middleware/validate-descending";

const postsRouter = Router();

// Params
postsRouter.param("postId", postIdParam);

// GET
postsRouter.get("/", getAllPosts);
postsRouter.get("/filter", validatePostQueryTags, getPostsWithTags);
postsRouter.get("/order/date", validateDescending, getPostsOrderedByDate);
postsRouter.get("/order/likes", validateDescending, getPostsOrderedByLikes);
postsRouter.get("/:postId", getPost);

// POST
postsRouter.post("/", validatePost, addPost);

// PUT
postsRouter.put("/:postId/like", addLike);

// PATCH
postsRouter.patch("/:postId", updatePost);

// DELETE
postsRouter.delete("/:postId", deletePost);
postsRouter.delete("/:postId/like", removeLike);

export default postsRouter;
