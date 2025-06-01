import { Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { RegisterUserInput, LoginInput, LoginOutput } from '@mevn-todos/shared';
import { respond } from '../lib/responses';
import { ValidatedRequest } from '../middlewares/validation.middleware';

export const registerUser = async (
  req: ValidatedRequest<RegisterUserInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await authService.registerUser(req.validatedBody!);
    const [status, response] = respond.withMessage('User created successfully');
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: ValidatedRequest<LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { user, token } = await authService.login(req.validatedBody!);

    const responseData: LoginOutput = {
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };

    const [status, response] = respond.withData(
      'Login successful',
      responseData,
    );
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
