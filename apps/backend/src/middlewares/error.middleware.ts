import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError, ValidationError } from "../lib/errors";
import logger from "../lib/logger";
import { respond } from "../lib/responses";
import { HttpStatus } from "../constants/http";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const errorContext = {
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    stack: err.stack,
  };

  if (err instanceof ValidationError) {
    logger.warn("Validation error", {
      ...errorContext,
      validationErrors: err.errors.errors,
    });

    const [status, response] = respond.withValidationError(
      err.getFieldErrors(),
    );
    res.status(status).json(response);
    return;
  }

  if (err instanceof AppError) {
    logger.error("Application error", {
      ...errorContext,
      statusCode: err.statusCode,
    });

    const [status, response] = respond.withError(err.statusCode, err.message);
    res.status(status).json(response);
    return;
  }

  logger.error("Unexpected error", errorContext);

  const [status, response] = respond.withError(
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Internal server error",
  );
  res.status(status).json(response);
};
