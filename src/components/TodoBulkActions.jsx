export function TodoBulkActions({ onMarkAllAsDone, onClearDone }) {
  return (
    <div
      style={{
        marginTop: "12px",
        display: "flex",
        gap: "8px",
        fontSize: "13px",
      }}
    >
      <button
        onClick={onMarkAllAsDone}
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
        onClick={onClearDone}
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
  );
}
