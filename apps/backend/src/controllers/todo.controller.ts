import { Response, NextFunction } from 'express';
import {
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilterInput,
} from '../dto/todo.dto';
import { respond } from '../lib/responses';
import * as todoService from '../services/todo.service';
import { ValidatedRequest } from '../middlewares/validation.middleware';

export const createTodo = async (
  req: ValidatedRequest<CreateTodoInput>,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todo = await todoService.createTodo(
      req.user!._id.toString(),
      req.validatedBody!,
    );
    const [status, response] = respond.withData(
      'Todo created successfully',
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: ValidatedRequest<UpdateTodoInput>,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todo = await todoService.updateTodo(
      req.user!._id.toString(),
      req.params.todoId,
      req.validatedBody!,
    );
    const [status, response] = respond.withData(
      'Todo updated successfully',
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    await todoService.deleteTodo(req.user!._id.toString(), req.params.todoId);
    const [status, response] = respond.withMessage('Todo deleted successfully');
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todo = await todoService.getTodoById(
      req.user!._id.toString(),
      req.params.todoId,
    );
    const [status, response] = respond.withData(
      'Todo retrieved successfully',
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const listTodos = async (
  req: ValidatedRequest<unknown, unknown, TodoFilterInput>,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todos = await todoService.listTodos(
      req.user!._id.toString(),
      req.validatedQuery!,
    );
    const [status, response] = respond.withData(
      'Todos retrieved successfully',
      todos,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
