import { NextFunction, Request, Response } from "express";
import { ExpressError, STATUS_CODE, TPost } from "common";
import PostsStore from "../store/post-store";

const store = new PostsStore();

interface PostRequest extends Request {
  post?: TPost;
}

export function postIdParam(
  request: PostRequest,
  _response: Response,
  next: NextFunction,
  id: string,
) {
  if (typeof id !== "string") {
    const err: ExpressError = {
      name: "ExpressError",
      message: `Post id must be an uuid4 string!`,
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  const post = store.getPost(id);

  if (!post) {
    const err: ExpressError = {
      name: "ExpressError",
      message: `Post with id ${id} does not exist!`,
      code: STATUS_CODE.NOT_FOUND,
    };

    return next(err);
  }

  request.post = post;
  next();
}

export function getAllPosts(_request: Request, response: Response) {
  response.status(STATUS_CODE.OK).send(store.getAllPosts());
}

export function getPost(request: PostRequest, response: Response) {
  response.status(STATUS_CODE.OK).send(request.post);
}

export function getPostsWithTags(request: Request, response: Response) {
  const { tags } = request.body as { tags: string[] };
  const results = store.getPostsWithTags(tags);
  response.status(STATUS_CODE.OK).send(results);
}

export function getPostsOrderedByDate(request: Request, response: Response) {
  const descending = request.query.descending === "true";
  const results = store.getPostsOrderedByDate(descending);
  response.status(STATUS_CODE.OK).send(results);
}

export function getPostsOrderedByLikes(request: Request, response: Response) {
  const descending = request.query.descending === "true";
  const results = store.getPostsOrderedByLikes(descending);
  response.status(STATUS_CODE.OK).send(results);
}

export function addPost(request: Request, response: Response) {
  const { title, body, tags } = request.body as {
    title: string;
    body: string;
    tags: string[];
  };

  const newPost = store.addPost(title, body, tags);
  response.status(STATUS_CODE.CREATED).send(newPost);
}

export function updatePost(
  request: PostRequest,
  response: Response,
  next: NextFunction,
) {
  let { title, body, tags } = request.body as {
    title?: string;
    body?: string;
    tags?: string[];
  };

  if (!request.post) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No post id was provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  const updatedPost = store.updatePost(
    request.post.id,
    title || request.post.title,
    body || request.post.body,
    tags || request.post.tags,
  );

  response.status(STATUS_CODE.OK).send(updatedPost);
}

export function deletePost(
  request: PostRequest,
  response: Response,
  next: NextFunction,
) {
  if (!request.post) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No post id was provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  store.deletePost(request.post.id);
  response.status(STATUS_CODE.NO_CONTENT).send();
}
