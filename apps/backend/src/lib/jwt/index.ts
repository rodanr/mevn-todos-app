import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AppError } from '../errors';

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwtSecret) as { userId: string };
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token');
  }
};
