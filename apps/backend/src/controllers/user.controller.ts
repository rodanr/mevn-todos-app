import { Request, Response, NextFunction } from "express";
import logger from "../lib/logger";
import * as userService from "../services/user.service";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logger.info("createUser called with body:", req.body);
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    logger.error("Error creating user:", error);
    next(error);
  }
};
