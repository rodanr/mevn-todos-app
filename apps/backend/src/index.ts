import express from "express";
import type { CreateTodoInput, Todo } from "@mevn-todos/shared";

const app = express();
app.use(express.json());

const todos: Todo[] = [];

app.post("/todos", (req, res) => {
  const input = req.body as CreateTodoInput;
  const todo: Todo = {
    ...input,
    id: Date.now().toString(),
    createdAt: new Date(),
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.get("/todos", (_req, res) => {
  res.json(todos);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
