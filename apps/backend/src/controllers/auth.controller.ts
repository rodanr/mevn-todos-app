import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { loginSchema, registerUserSchema } from "../dto/auth.dto";
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginData = loginSchema.safeParse(req.body);
    if (!loginData.success) {
      const [status, response] = respond.withValidationError(
        loginData.error.flatten().fieldErrors,
      );
      return res.status(status).json(response);
    }

    const { user, token } = await authService.login(loginData.data);
    const [status, response] = respond.withData("Login successful", {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
