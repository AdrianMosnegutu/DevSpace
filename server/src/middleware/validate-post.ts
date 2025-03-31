import { ExpressError, STATUS_CODE } from "common";
import { NextFunction, Request, Response } from "express";

export function validatePostTitle(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const { title } = request.body;

  if (!title) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No title provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (typeof title !== "string") {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Title must be a string!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}

export function validatePostBody(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const { body } = request.body;

  if (!body) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No body provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (typeof body !== "string") {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Body must be a string!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}

export function validatePostTags(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const { tags } = request.body;

  if (!tags) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No tags provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (!Array.isArray(tags)) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Tags must be in the form of an array!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (tags.some((tag) => typeof tag !== "string")) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "All tags must be strings!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}

export function validatePost(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  validatePostTitle(request, response, next);
  validatePostBody(request, response, next);
  validatePostTags(request, response, next);

  next();
}
