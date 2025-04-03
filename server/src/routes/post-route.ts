import { Router } from "express";
import {
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
  removeLike,
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
postsRouter.post("/like/:postId", addLike);
postsRouter.post("/unlike/:postId", removeLike);

// PATCH
postsRouter.patch("/:postId", updatePost);

// DELETE
postsRouter.delete("/:postId", deletePost);

export default postsRouter;
