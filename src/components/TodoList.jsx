export function TodoList({
  todos,
  editingId,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onToggle,
  onRemove,
  onPriorityChange,
}) {
  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: "16px" }}>
      {todos.length === 0 && (
        <li style={{ color: "#777", fontSize: "14px" }}>
          Brak zadań. Dodaj coś powyżej 🔼
        </li>
      )}

      {todos.map((todo) => (
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
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => onToggle(todo.id)}
            />
            <PriorityDot priority={todo.priority || "normal"} />
            {editingId === todo.id ? (
              <input
                value={editingText}
                onChange={(e) => onEditingTextChange(e.target.value)}
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
              onChange={(e) => onPriorityChange(todo.id, e.target.value)}
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
                  onClick={() => onSaveEdit(todo.id)}
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
                  onClick={onCancelEdit}
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
                  onClick={() => onStartEdit(todo)}
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
                  onClick={() => onRemove(todo.id)}
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
