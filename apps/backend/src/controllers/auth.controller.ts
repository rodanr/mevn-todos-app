import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { registerUserSchema } from "../dto/auth.dto";
import { respond } from "../lib/responses";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = registerUserSchema.safeParse(req.body);
    if (!userData.success) {
      const [status, response] = respond.withValidationError(
        userData.error.flatten().fieldErrors,
      );
      return res.status(status).json(response);
    }

    await authService.registerUser(userData.data);
    const [status, response] = respond.withMessage("User created successfully");
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
