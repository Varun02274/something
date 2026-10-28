
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

// Get all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Add a todo
app.post("/todos", (req, res) => {
  const todo = {
    id: nextId++,
    text: req.body.text,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(
    (todo) => todo.id !== Number(req.params.id)
  );

  res.json({ message: "Todo deleted" });
});

app.listen(3000, () => {
  console.log("Server running on port 5000");
});
