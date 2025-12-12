export function TodoForm({
  text,
  onTextChange,
  priority,
  onPriorityChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", gap: "8px", marginTop: "8px" }}
    >
      <input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Wpisz zadanie..."
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
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
  );
}
