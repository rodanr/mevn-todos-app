import { CreateUserInput } from "../dto/user.dto";
import logger from "../lib/logger";

export const createUser = async (data: CreateUserInput) => {
  logger.info("Creating user with data:", data);
  // TODO: Add actual user creation logic
  return {
    success: true,
    data,
  };
};
