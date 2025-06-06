import { z } from 'zod';

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
  overdue: z
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
