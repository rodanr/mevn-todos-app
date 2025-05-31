import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Document, UserAttrs {
  _id: Types.ObjectId;
}

// Type for authenticated user without password
export type AuthUser = Omit<UserDocument, "password">;

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  userSchema,
);
