import { Types } from 'mongoose';
import {
  CreateTodoInput,
  TodoFilterInput,
  UpdateTodoInput,
} from '../dto/todo.dto';
import { AppError } from '../lib/errors';
import logger from '../lib/logger';
import { Todo, TodoDocument } from '../models';

export const createTodo = async (
  userId: string,
  data: CreateTodoInput,
): Promise<TodoDocument> => {
  logger.info('Creating todo for user:', userId);
  const todo = new Todo({
    ...data,
    userId: new Types.ObjectId(userId),
  });
  await todo.save();
  return todo;
};

export const updateTodo = async (
  userId: string,
  todoId: string,
  data: UpdateTodoInput,
): Promise<TodoDocument> => {
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
  return todo;
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
): Promise<TodoDocument> => {
  const todo = await Todo.findOne({
    _id: todoId,
    userId: new Types.ObjectId(userId),
  });

  if (!todo) {
    throw new AppError(404, 'Todo not found');
  }

  return todo;
};

export const listTodos = async (
  userId: string,
  filters: TodoFilterInput,
): Promise<TodoDocument[]> => {
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

  return Todo.find(query).sort({ dueDate: 1 });
};
