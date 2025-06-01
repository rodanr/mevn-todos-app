import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { respond } from '../lib/responses';

export interface ValidatedRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
> extends Request {
  validatedBody?: TBody;
  validatedParams?: TParams;
  validatedQuery?: TQuery;
}

export const validate = (schemas: {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate body if schema provided
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body);
        if (!bodyResult.success) {
          const fieldErrors = Object.fromEntries(
            Object.entries(bodyResult.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value || []],
            ),
          ) as Record<string, string[]>;

          const [status, response] = respond.withValidationError(fieldErrors);
          res.status(status).json(response);
          return;
        }
        (req as ValidatedRequest).validatedBody = bodyResult.data;
      }

      // Validate params if schema provided
      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params);
        if (!paramsResult.success) {
          const fieldErrors = Object.fromEntries(
            Object.entries(paramsResult.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value || []],
            ),
          ) as Record<string, string[]>;

          const [status, response] = respond.withValidationError(fieldErrors);
          res.status(status).json(response);
          return;
        }
        (req as ValidatedRequest).validatedParams = paramsResult.data;
      }

      // Validate query if schema provided
      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query);
        if (!queryResult.success) {
          const fieldErrors = Object.fromEntries(
            Object.entries(queryResult.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value || []],
            ),
          ) as Record<string, string[]>;

          const [status, response] = respond.withValidationError(fieldErrors);
          res.status(status).json(response);
          return;
        }
        (req as ValidatedRequest).validatedQuery = queryResult.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateBody = (schema: ZodSchema): RequestHandler =>
  validate({ body: schema });
export const validateParams = (schema: ZodSchema): RequestHandler =>
  validate({ params: schema });
export const validateQuery = (schema: ZodSchema): RequestHandler =>
  validate({ query: schema });
