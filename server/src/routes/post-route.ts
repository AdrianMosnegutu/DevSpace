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
  getPostsOnPage,
  getNewestPost,
  getOldestPost,
  getMostLikedPost,
  getLeastLikedPost,
} from "../controllers/post-controller";
import {
  validatePostBody,
  validatePostBodyTags,
  validatePostQueryTags,
  validatePostTitle,
} from "../middleware/validate-post";
import validateDescending from "../middleware/validate-descending";
import validatePage from "../middleware/validate-page";

const postsRouter = Router();

// Params
postsRouter.param("postId", postIdParam);

// GET
postsRouter.get("/", validatePage, getPostsOnPage);
postsRouter.get("/all", getAllPosts);

// GET a post with a special property
postsRouter.get("/newest", getNewestPost);
postsRouter.get("/oldest", getOldestPost);
postsRouter.get("/mostLiked", getMostLikedPost);
postsRouter.get("/leastLiked", getLeastLikedPost);

// GET filtered posts
postsRouter.get("/filter", validatePostQueryTags, getPostsWithTags);

// GET ordered posts
postsRouter.get(
  "/order/date",
  validatePage,
  validateDescending,
  getPostsOrderedByDate,
);
postsRouter.get(
  "/order/likes",
  validatePage,
  validateDescending,
  getPostsOrderedByLikes,
);

// GET a specific post
postsRouter.get("/:postId", getPost);

// POST
postsRouter.post(
  "/",
  validatePostTitle,
  validatePostBody,
  validatePostBodyTags,
  addPost,
);

// PUT
postsRouter.put("/:postId/like", addLike);

// PATCH
postsRouter.patch("/:postId", updatePost);

// DELETE
postsRouter.delete("/:postId", deletePost);
postsRouter.delete("/:postId/like", removeLike);

export default postsRouter;
