import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../common/enums/httpStatus";
import { ZodError } from "zod";

export function ZodErrorHandlerMiddleware(
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ZodError) {
    const message = err.issues.reduce((acc, issue) => {
      let message = "";

      const path = issue.path.join(".");
      message += `${path} - ${issue.message}`;

      acc.push(message);
      return acc;
    }, Array<string>());

    res.status(HttpStatus.BAD_REQUEST).json({
      error: "InvalidParameters",
      message: message,
    });
    console.error("Zod validation error:", err);

    return;
  }

  // Si no es ZodError, pasar al siguiente middleware
  next(err);
}
