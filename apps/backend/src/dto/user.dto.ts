import { z } from "zod";
import { VALIDATION_LIMITS } from "../constants";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(VALIDATION_LIMITS.USER.MIN_USERNAME_LENGTH, "Username is too short")
      .max(VALIDATION_LIMITS.USER.MAX_USERNAME_LENGTH, "Username is too long"),
    firstName: z
      .string()
      .min(
        VALIDATION_LIMITS.USER.MIN_FIRSTNAME_LENGTH,
        "First name is too short",
      )
      .max(
        VALIDATION_LIMITS.USER.MAX_FIRSTNAME_LENGTH,
        "First name is too long",
      ),
    lastName: z
      .string()
      .min(VALIDATION_LIMITS.USER.MIN_LASTNAME_LENGTH, "Last name is too short")
      .max(VALIDATION_LIMITS.USER.MAX_LASTNAME_LENGTH, "Last name is too long"),
    email: z
      .string()
      .email("Invalid email format")
      .max(VALIDATION_LIMITS.USER.MAX_EMAIL_LENGTH, "Email is too long"),
    password: z
      .string()
      .min(
        VALIDATION_LIMITS.USER.MIN_PASSWORD_LENGTH,
        "Password must be at least 8 characters",
      )
      .max(VALIDATION_LIMITS.USER.MAX_PASSWORD_LENGTH, "Password is too long"),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema.shape.body>;
