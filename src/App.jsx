import { useEffect, useReducer, useState } from "react";
import {
  createTodo,
  addTodo,
  toggleTodo,
  removeTodo,
  filterTodos,
  updateTodoText,
  getStats,
  serializeTodos,
  deserializeTodos,
  clearDone,
  markAllDone,
  sortTodos,
  changePriority,
} from "./pure/todos"; 

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
      const newPresent = updater(state.present);

      if (newPresent === state.present) return state;

      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: [],
      };
    }
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
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
        past: [...state.past, state.present],
        present: next,
        future: rest,
      };
    }
    default:
      return state;
  }
}

function searchTodos(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => t.text.toLowerCase().includes(q));
}

function App() {
  const [history, dispatch] = useReducer(historyReducer, initialHistory);
  const todos = history.present;

  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [sortMode, setSortMode] = useState("newest"); 
  const [searchText, setSearchText] = useState("");
  const [newPriority, setNewPriority] = useState("normal"); 

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportText, setExportText] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const applyToTodos = (updater) => {
    dispatch({ type: "APPLY", updater });
  };

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

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTodo = createTodo(Date.now(), text, newPriority);

    applyToTodos((current) => addTodo(current, newTodo));
    setText("");
  };

  const handleToggle = (id) => {
    applyToTodos((current) => toggleTodo(current, id));
  };

  const handleRemove = (id) => {
    applyToTodos((current) => removeTodo(current, id));
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) {
      setEditingId(null);
      setEditingText("");
      return;
    }
    applyToTodos((current) => updateTodoText(current, id, editingText));
    setEditingId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleClearDone = () => {
    applyToTodos((current) => clearDone(current));
  };

  const handleMarkAllDone = () => {
    applyToTodos((current) => markAllDone(current));
  };

  const handleChangePriority = (id, priority) => {
    applyToTodos((current) => changePriority(current, id, priority));
  };

  const handleOpenExport = () => {
    const json = serializeTodos(todos);
    setExportText(json);
    setIsExportOpen(true);
  };

  const handleImport = () => {
    try {
      const list = deserializeTodos(importText);
      dispatch({ type: "LOAD", todos: list });
      setImportError("");
      setIsImportOpen(false);
      setImportText("");
    } catch (e) {
      setImportError("Nie udało się wczytać danych. Sprawdź JSON.");
    }
  };

  const filteredTodos = (() => {
    if (filter === "all") return todos;
    if (filter === "done") return filterTodos(todos, true);
    if (filter === "notDone") return filterTodos(todos, false);
    return todos;
  })();

  const searchedTodos = searchTodos(filteredTodos, searchText);
  const visibleTodos = sortTodos(searchedTodos, sortMode);

  const stats = getStats(todos);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "620px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px", fontSize: "24px" }}>
          Functional Todo App
        </h1>
        <p
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          Dane zapisują się automatycznie w przeglądarce (localStorage).
        </p>

        
        <StatsBar stats={stats} />

        {}
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: "8px", marginTop: "8px" }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Wpisz zadanie..."
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd", 
            }}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "13px",
            }}
          >
            <option value="low">Niski</option>
            <option value="normal">Normalny</option>
            <option value="high">Wysoki</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Dodaj
          </button>
        </form>

        {}
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Szukaj w zadaniach..."
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "13px",
          }}
        />

        {}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Wszystkie
          </FilterButton>
          <FilterButton
            active={filter === "notDone"}
            onClick={() => setFilter("notDone")}
          >
            Do zrobienia
          </FilterButton>
          <FilterButton
            active={filter === "done"}
            onClick={() => setFilter("done")}
          >
            Zrobione
          </FilterButton>
        </div>

        {}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <button
            onClick={handleMarkAllDone}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fafafa",
              cursor: "pointer",
            }}
          >
            Oznacz wszystkie jako zrobione
          </button>
          <button
            onClick={handleClearDone}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fafafa",
              cursor: "pointer",
            }}
          >
            Usuń zrobione
          </button>
        </div>

        {}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={!canUndo}
              style={{
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: canUndo ? "#f9fafb" : "#f3f4f6",
                cursor: canUndo ? "pointer" : "not-allowed",
                fontSize: "13px",
              }}
            >
              ⟲ Cofnij
            </button>
            <button
              onClick={() => dispatch({ type: "REDO" })}
              disabled={!canRedo}
              style={{
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: canRedo ? "#f9fafb" : "#f3f4f6",
                cursor: canRedo ? "pointer" : "not-allowed",
                fontSize: "13px",
              }}
            >
              ⟳ Ponów
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span style={{ color: "#666" }}>Sortuj:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <option value="newest">Najnowsze na górze</option>
              <option value="oldest">Najstarsze na górze</option>
              <option value="undoneFirst">Niezrobione na górze</option>
            </select>
          </div>
        </div>

        {}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <button
            onClick={handleOpenExport}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            Eksportuj JSON
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            Importuj JSON
          </button>
        </div>

        {}
        <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
          {visibleTodos.length === 0 && (
            <li style={{ color: "#777", fontSize: "14px" }}>
              Brak zadań. Dodaj coś powyżej 🔼
            </li>
          )}

          {visibleTodos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <label
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                />
                <PriorityDot priority={todo.priority || "normal"} />
                {editingId === todo.id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{
                      padding: "4px 6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: todo.done ? "line-through" : "none",
                      color: todo.done ? "#999" : "#222",
                    }}
                  >
                    {todo.text}
                  </span>
                )}
              </label>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select
                  value={todo.priority || "normal"}
                  onChange={(e) =>
                    handleChangePriority(todo.id, e.target.value)
                  }
                  style={{
                    padding: "4px 6px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "12px",
                  }}
                >
                  <option value="low">Niski</option>
                  <option value="normal">Normalny</option>
                  <option value="high">Wysoki</option>
                </select>

                {editingId === todo.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      💾
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(todo)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleRemove(todo.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {}
        {isExportOpen && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "4px" }}>
              Eksportowane dane (JSON):
            </h3>
            <textarea
              value={exportText}
              readOnly
              rows={4}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
            <div style={{ marginTop: "8px", textAlign: "right" }}>
              <button
                onClick={() => setIsExportOpen(false)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Zamknij
              </button>
            </div>
          </div>
        )}

        {}
        {isImportOpen && (
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ fontSize: "14px", marginBottom: "4px" }}>
              Wklej dane JSON do importu:
            </h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            />
            {importError && (
              <div
                style={{
                  marginTop: "4px",
                  color: "#b91c1c",
                  fontSize: "12px",
                }}
              >
                {importError}
              </div>
            )}
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => {
                  setIsImportOpen(false);
                  setImportText("");
                  setImportError("");
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#f3f4f6",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Anuluj
              </button>
              <button
                onClick={handleImport}
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid #111827",
                  background: "#111827",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Importuj
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, children, ...rest }) {
  return (
    <button
      {...rest}
      style={{
        flex: 1,
        padding: "8px 10px",
        borderRadius: "999px",
        border: active ? "0" : "1px solid #e5e7eb",
        background: active ? "#111827" : "#f9fafb",
        color: active ? "#f9fafb" : "#111827",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: active ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
        transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function StatsBar({ stats }) {
  const progress =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "13px",
          marginBottom: "8px",
        }}
      >
        <StatPill label="Wszystkie" value={stats.total} />
        <StatPill label="Zrobione" value={stats.done} />
        <StatPill label="Do zrobienia" value={stats.notDone} />
      </div>
      <div
        style={{
          marginTop: "4px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          height: "8px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#16a34a",
            transition: "width 0.2s",
          }}
        />
      </div>
      <div
        style={{
          marginTop: "2px",
          fontSize: "11px",
          color: "#6b7280",
          textAlign: "right",
        }}
      >
        Postęp: {progress}%
      </div>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        background: "#e5e7eb",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          minWidth: "24px",
          height: "24px",
          borderRadius: "999px",
          background: "white",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: "13px",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: "13px" }}>{label}</span>
    </div>
  );
}

function PriorityDot({ priority }) {
  const color =
    priority === "high"
      ? "#ef4444"
      : priority === "low"
      ? "#22c55e"
      : "#f59e0b";

  return (
    <span
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "999px",
        background: color,
        display: "inline-block",
      }}
    />
  );
}

export default App;
