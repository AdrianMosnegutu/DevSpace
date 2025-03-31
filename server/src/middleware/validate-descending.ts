import { ExpressError, STATUS_CODE } from "common";
import { Request, Response, NextFunction } from "express";

export default function validateDescending(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const { descending } = request.body;

  if (descending === null) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "No ordering provided!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (typeof descending !== "boolean") {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Ordering property must be a boolean!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}
