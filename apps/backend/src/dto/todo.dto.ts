import { z } from 'zod';
import type { TodoDocument } from '../models/todo.model';

const todoBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description is too long'),
  dueDate: z.string().datetime('Invalid date format'),
});

export const createTodoSchema = todoBaseSchema;

export const updateTodoSchema = todoBaseSchema.partial().extend({
  isDone: z.boolean().optional(),
});

export const todoFilterSchema = z.object({
  isDone: z
    .enum(['true', 'false'])
    .nullish()
    .transform((val) =>
      val === null || val === undefined ? undefined : val === 'true',
    ),
  upcoming: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true'),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoFilterInput = z.infer<typeof todoFilterSchema>;

export interface TodoResponseDto {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isDone: boolean;
  completedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const toTodoResponseDto = (document: TodoDocument): TodoResponseDto => {
  return {
    id: document.id || document._id.toString(),
    name: document.name,
    description: document.description,
    dueDate: document.dueDate.toISOString(),
    isDone: document.isDone,
    completedAt: document.completedAt?.toISOString() || null,
    userId: document.userId.toString(),
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
};

export const toTodoResponseDtoList = (
  documents: TodoDocument[],
): TodoResponseDto[] => {
  return documents.map(toTodoResponseDto);
};

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginatedTodosResponse {
  todos: TodoResponseDto[];
  pagination: PaginationMeta;
}
