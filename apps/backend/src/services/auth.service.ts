import { RegisterUserInput } from "../dto/auth.dto";
import { AppError } from "../lib/errors";
import logger from "../lib/logger";
import { User, UserDocument } from "../models";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  logger.info("getUserByEmail called with email:", email);
  return User.findOne({ email: email.toLowerCase() });
};

export const registerUser = async (
  data: RegisterUserInput,
): Promise<{ user: UserDocument }> => {
  logger.info("createUser called with data:", data);
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new AppError(400, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = new User({
    ...data,
    password: hashedPassword,
  });
  await user.save();

  return { user };
};
