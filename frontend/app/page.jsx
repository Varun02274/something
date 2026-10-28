
"use client"

import { useEffect, useState } from "react";

const API = "http://localhost:3000/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then(setTodos)
      .catch(() => setError("Cannot connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  async function addTodo(e) {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      setError("");

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const todo = await res.json();
      setTodos((prev) => [...prev, todo]);
      setText("");
    } catch {
      setError("Could not add task. Try again.");
    }
  }

  async function deleteTodo(id) {
    try {
      setError("");

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setError("Could not delete task. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Todo App
          </h1>
          <p className="mt-2 text-slate-500">
            Keep track of what you need to do.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <form onSubmit={addTodo} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              aria-label="New task"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              Add
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mb-4 mt-6 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">
              Your tasks
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {todos.length} total
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-500">
              Loading tasks...
            </p>
          ) : todos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
              <p className="font-medium text-slate-600">
                No tasks yet
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Add a task above to get started.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="break-words text-slate-700">
                    {todo.text}
                  </span>

                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete ${todo.text}`}
                    className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="mt-5 text-center text-sm text-slate-400">
          Stay organized, one task at a time.
        </p>
      </div>
    </main>
  );
}
