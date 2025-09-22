import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../common/enums/httpStatus";
import { HttpException } from "../config/httpException";

export const ErrorHandlerMiddleware = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";

  if (err instanceof HttpException) {
    status = err.getStatus();
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(status).json({
    message,
  });
  next(err);
};
