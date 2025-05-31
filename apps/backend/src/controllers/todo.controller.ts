import { Request, Response, NextFunction } from "express";
import {
  createTodoSchema,
  todoFilterSchema,
  updateTodoSchema,
} from "../dto/todo.dto";
import { respond } from "../lib/responses";
import * as todoService from "../services/todo.service";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todoData = createTodoSchema.safeParse(req.body);
    if (!todoData.success) {
      const [status, response] = respond.withValidationError(
        todoData.error.flatten().fieldErrors,
      );
      return res.status(status).json(response);
    }

    const todo = await todoService.createTodo(
      req.user!._id.toString(),
      todoData.data,
    );
    const [status, response] = respond.withData(
      "Todo created successfully",
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todoData = updateTodoSchema.safeParse(req.body);
    if (!todoData.success) {
      const [status, response] = respond.withValidationError(
        todoData.error.flatten().fieldErrors,
      );
      return res.status(status).json(response);
    }

    const todo = await todoService.updateTodo(
      req.user!._id.toString(),
      req.params.todoId,
      todoData.data,
    );
    const [status, response] = respond.withData(
      "Todo updated successfully",
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    await todoService.deleteTodo(req.user!._id.toString(), req.params.todoId);
    const [status, response] = respond.withMessage("Todo deleted successfully");
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const todo = await todoService.getTodoById(
      req.user!._id.toString(),
      req.params.todoId,
    );
    const [status, response] = respond.withData(
      "Todo retrieved successfully",
      todo,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export const listTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const filterData = todoFilterSchema.safeParse(req.query);
    if (!filterData.success) {
      const [status, response] = respond.withValidationError(
        filterData.error.flatten().fieldErrors,
      );
      return res.status(status).json(response);
    }

    const todos = await todoService.listTodos(
      req.user!._id.toString(),
      filterData.data,
    );
    const [status, response] = respond.withData(
      "Todos retrieved successfully",
      todos,
    );
    return res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};
