import { useEffect, useReducer } from "react";
import {
  createTodo,
  addTodo,
  toggleTodo,
  removeTodo,
  updateTodoText,
  clearDone,
  markAllDone,
  changePriority,
  serializeTodos,
  deserializeTodos,
} from "../pure/todos";

const STORAGE_KEY = "functional-todo-list";

const initialHistory = {
  past: [],
  present: [],
  future: [],
};

function historyReducer(state, action) {
  switch (action.type) {
    case "LOAD": {
      const todos = action.todos || [];
      return { past: [], present: todos, future: [] };
    }
    case "APPLY": {
      const updater = action.updater;
      const current = state.present;
      const next = updater(current);

      if (Object.is(next, current)) return state;

      return {
        past: state.past.concat([current]),
        present: next,
        future: [],
      };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;

      return {
        past: state.past.concat([state.present]),
        present: next,
        future: rest,
      };
    }
    default:
      return state;
  }
}

export function useTodosStore() {
  const [history, dispatch] = useReducer(historyReducer, initialHistory);
  const todos = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const list = deserializeTodos(stored);
      dispatch({ type: "LOAD", todos: list });
    }
  }, []);

  useEffect(() => {
    const json = serializeTodos(todos);
    window.localStorage.setItem(STORAGE_KEY, json);
  }, [todos]);

  const apply = (updater) => {
    dispatch({ type: "APPLY", updater });
  };

  const add = (text, priority) => {
    if (!text.trim()) return;
    const todo = createTodo(Date.now(), text, priority);
    apply((current) => addTodo(current, todo));
  };

  const toggle = (id) => {
    apply((current) => toggleTodo(current, id));
  };

  const remove = (id) => {
    apply((current) => removeTodo(current, id));
  };

  const updateText = (id, newText) => {
    apply((current) => updateTodoText(current, id, newText));
  };

  const setPriority = (id, priority) => {
    apply((current) => changePriority(current, id, priority));
  };

  const clearDoneTodos = () => {
    apply((current) => clearDone(current));
  };

  const markAllAsDone = () => {
    apply((current) => markAllDone(current));
  };

  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });

  const replaceAll = (newTodos) => {
    dispatch({ type: "LOAD", todos: newTodos });
  };

  return {
    todos,
    add,
    toggle,
    remove,
    updateText,
    setPriority,
    clearDoneTodos,
    markAllAsDone,
    undo,
    redo,
    canUndo,
    canRedo,
    replaceAll,
  };
}
