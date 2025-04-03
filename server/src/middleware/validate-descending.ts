import { ExpressError, STATUS_CODE } from "common";
import { Request, Response, NextFunction } from "express";

export default function validateDescending(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const descending = request.query.descending;

  if (
    descending !== undefined &&
    descending !== "true" &&
    descending !== "false"
  ) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Ordering property must be true or false!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}
