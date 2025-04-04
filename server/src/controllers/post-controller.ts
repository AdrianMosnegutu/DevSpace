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

export function getPostsOnPage(request: Request, response: Response) {
  const page = Number(request.query.page);
  response.status(STATUS_CODE.OK).send(store.getPostsOnPage(page));
}

export function getPost(request: PostRequest, response: Response) {
  response.status(STATUS_CODE.OK).send(request.post);
}

export function getNewestPost(_request: Request, response: Response) {
  const newestPost = store.getNewestPost();

  if (newestPost) {
    response.status(STATUS_CODE.OK).send(newestPost);
  } else {
    response.status(STATUS_CODE.NOT_FOUND).send("There are no posts!");
  }
}

export function getOldestPost(_request: Request, response: Response) {
  const oldestPost = store.getOldestPost();

  if (oldestPost) {
    response.status(STATUS_CODE.OK).send(oldestPost);
  } else {
    response.status(STATUS_CODE.NOT_FOUND).send("There are no posts!");
  }
}

export function getMostLikedPost(_request: Request, response: Response) {
  const mostLikedPost = store.getMostLikedPost();

  if (mostLikedPost) {
    response.status(STATUS_CODE.OK).send(mostLikedPost);
  } else {
    response.status(STATUS_CODE.NOT_FOUND).send("There are no posts!");
  }
}

export function getLeastLikedPost(_request: Request, response: Response) {
  const leastLikedPost = store.getLeastLikedPost();

  if (leastLikedPost) {
    response.status(STATUS_CODE.OK).send(leastLikedPost);
  } else {
    response.status(STATUS_CODE.NOT_FOUND).send("There are no posts!");
  }
}

export function getPostsWithTags(request: Request, response: Response) {
  const { tags: tagsQuery } = request.query as { tags: string };
  const tags = tagsQuery.split(",");

  const results = store.getPostsWithTags(tags);
  response.status(STATUS_CODE.OK).send(results);
}

export function getPostsOrderedByDate(request: Request, response: Response) {
  const page = Number(request.query.page);
  const descending = request.query.descending === "true";

  const results = store.getPostsOrderedByDate(page, descending);
  response.status(STATUS_CODE.OK).send(results);
}

export function getPostsOrderedByLikes(request: Request, response: Response) {
  const page = Number(request.query.page);
  const descending = request.query.descending === "true";

  const results = store.getPostsOrderedByLikes(page, descending);
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

export function addLike(request: PostRequest, response: Response) {
  store.addLike((request.post as TPost).id);
  response.status(STATUS_CODE.NO_CONTENT).send();
}

export function removeLike(request: PostRequest, response: Response) {
  store.removeLike((request.post as TPost).id);
  response.status(STATUS_CODE.NO_CONTENT).send();
}

export function updatePost(request: PostRequest, response: Response) {
  let { title, body, tags } = request.body as {
    title?: string;
    body?: string;
    tags: string[];
  };

  const updatedPost = store.updatePost(
    (request.post as TPost).id,
    title || (request.post as TPost).title,
    body || (request.post as TPost).body,
    tags || (request.post as TPost).tags,
  );

  response.status(STATUS_CODE.OK).send(updatedPost);
}

export function deletePost(request: PostRequest, response: Response) {
  store.deletePost((request.post as TPost).id);
  response.status(STATUS_CODE.NO_CONTENT).send();
}
