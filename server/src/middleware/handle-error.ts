import { ExpressError, STATUS_CODE } from "common";
import { NextFunction, Request, Response } from "express";

export default function handleError(
  error: ExpressError,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const status = error.code || STATUS_CODE.SERVER_ERROR;
  response.status(status).send(error.message);
}
