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
import { validatePost, validatePostTags } from "../middleware/validate-post";
import validateDescending from "../middleware/validate-descending";

const postsRouter = Router();

// Params
postsRouter.param("postId", postIdParam);

// GET
postsRouter.get("/", getAllPosts);
postsRouter.get("/:postId", getPost);
postsRouter.get("/filter/tags", validatePostTags, getPostsWithTags);
postsRouter.get("/order/date", validateDescending, getPostsOrderedByDate);
postsRouter.get("/order/likes", validateDescending, getPostsOrderedByLikes);

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
