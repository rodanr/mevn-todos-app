import { Types } from 'mongoose';
import {
  CreateTodoInput,
  TodoFilterInput,
  UpdateTodoInput,
  PaginatedTodosResponse,
  TodoResponseDto,
} from '@mevn-todos/shared';
import { AppError } from '../lib/errors';
import logger from '../lib/logger';
import { Todo, TodoDocument } from '../models';

const toTodoResponseDto = (document: TodoDocument): TodoResponseDto => {
  return {
    id: document.id || document._id!.toString(),
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

const toTodoResponseDtoList = (
  documents: TodoDocument[],
): TodoResponseDto[] => {
  return documents.map(toTodoResponseDto);
};

export const createTodo = async (
  userId: string,
  data: CreateTodoInput,
): Promise<TodoResponseDto> => {
  logger.info('Creating todo for user:', userId);
  const todo = new Todo({
    ...data,
    userId: new Types.ObjectId(userId),
  });
  await todo.save();
  return toTodoResponseDto(todo);
};

export const updateTodo = async (
  userId: string,
  todoId: string,
  data: UpdateTodoInput,
): Promise<TodoResponseDto> => {
  logger.info('Updating todo:', todoId, 'for user:', userId);
  const todo = await Todo.findOne({
    _id: todoId,
    userId: new Types.ObjectId(userId),
  });

  if (!todo) {
    throw new AppError(404, 'Todo not found');
  }

  // Handle completedAt when isDone is updated
  if (data.isDone !== undefined) {
    if (data.isDone && !todo.isDone) {
      // Setting to done
      todo.completedAt = new Date();
    } else if (!data.isDone) {
      // Setting to not done
      todo.completedAt = null;
    }
  }

  Object.assign(todo, data);
  await todo.save();
  return toTodoResponseDto(todo);
};

export const deleteTodo = async (
  userId: string,
  todoId: string,
): Promise<void> => {
  logger.info('Deleting todo:', todoId, 'for user:', userId);
  const result = await Todo.deleteOne({
    _id: todoId,
    userId: new Types.ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new AppError(404, 'Todo not found');
  }
};

export const getTodoById = async (
  userId: string,
  todoId: string,
): Promise<TodoResponseDto> => {
  const todo = await Todo.findOne({
    _id: todoId,
    userId: new Types.ObjectId(userId),
  });

  if (!todo) {
    throw new AppError(404, 'Todo not found');
  }

  return toTodoResponseDto(todo);
};

export const listTodos = async (
  userId: string,
  filters: TodoFilterInput,
): Promise<PaginatedTodosResponse<TodoResponseDto>> => {
  logger.info('Listing todos for user:', userId, 'with filters:', filters);

  const query: {
    userId: Types.ObjectId;
    isDone?: boolean;
    dueDate?: { $gte: Date };
  } = {
    userId: new Types.ObjectId(userId),
  };

  if (filters.upcoming) {
    query.dueDate = { $gte: new Date() };
    // Ensure upcoming todos are not done
    query.isDone = false;
  } else if (filters.isDone !== undefined) {
    query.isDone = filters.isDone;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalItems = await Todo.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  // Get paginated todos
  const todoDocuments = await Todo.find(query)
    .sort({ dueDate: 1 })
    .skip(skip)
    .limit(limit);

  return {
    todos: toTodoResponseDtoList(todoDocuments),
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
