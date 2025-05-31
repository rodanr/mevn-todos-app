import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  listTodos,
  updateTodo,
} from "../controllers/todo.controller";

const router: Router = Router();

router.use(authenticate);

router.post("/todos", createTodo);
router.get("/todos", listTodos);
router.get("/todos/:todoId", getTodoById);
router.patch("/todos/:todoId", updateTodo);
router.delete("/todos/:todoId", deleteTodo);

export default router;
