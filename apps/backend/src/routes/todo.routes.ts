import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateBody,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  todoFilterSchema,
} from '@mevn-todos/shared';
import {
  createTodo,
  deleteTodo,
  getTodoById,
  listTodos,
  updateTodo,
} from '../controllers/todo.controller';

const router: Router = Router();

router.use(authenticate);

router.post('/todos', validateBody(createTodoSchema), createTodo);
router.get('/todos', validateQuery(todoFilterSchema), listTodos);
router.get('/todos/:todoId', getTodoById);
router.patch('/todos/:todoId', validateBody(updateTodoSchema), updateTodo);
router.delete('/todos/:todoId', deleteTodo);

export default router;
