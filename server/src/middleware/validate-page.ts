import { ExpressError, STATUS_CODE } from "common";
import { Request, Response, NextFunction } from "express";

export default function validatePage(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const { page } = request.query;

  if (!page) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Page query parameter is missing!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  if (Number.isNaN(Number(page)) || !Number.isInteger(Number(page))) {
    const err: ExpressError = {
      name: "ExpressError",
      message: "Page query parameter must be an integer!",
      code: STATUS_CODE.BAD_REQUEST,
    };

    return next(err);
  }

  next();
}
