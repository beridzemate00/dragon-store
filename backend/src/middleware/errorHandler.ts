import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return;
  }

  const status = err.statusCode ?? 500;
  const message = err.message ?? "Server error";

  res.status(status).json({ message });
};
