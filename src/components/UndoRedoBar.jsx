export function UndoRedoBar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  sortMode,
  onSortModeChange,
}) {
  return (
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
          onClick={onUndo}
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
          onClick={onRedo}
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
          onChange={(e) => onSortModeChange(e.target.value)}
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
  );
}
