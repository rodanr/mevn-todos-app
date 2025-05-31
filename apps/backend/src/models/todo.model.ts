import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface TodoAttrs {
  name: string;
  description: string;
  dueDate: Date;
  isDone: boolean;
  completedAt?: Date | null;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoDocument extends Document, TodoAttrs {
  _id: Types.ObjectId;
}

const todoSchema = new Schema<TodoDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 500,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

todoSchema.index({ userId: 1, isDone: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });

export const Todo: Model<TodoDocument> = mongoose.model<TodoDocument>(
  "Todo",
  todoSchema,
);
