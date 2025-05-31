import { Request, Response, NextFunction } from 'express';
import { User, AuthUser } from '../models';
import { verifyToken } from '../lib/jwt';
import { AppError } from '../lib/errors';
import logger from '../lib/logger';

// Augment the Express Request interface
declare module 'express' {
  interface Request {
    user?: AuthUser;
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Authentication error:', error);
      next(new AppError(401, 'Authentication failed'));
    }
  }
};
