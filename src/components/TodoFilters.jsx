export function TodoFilters({
  filter,
  onFilterChange,
  searchText,
  onSearchTextChange,
}) {
  return (
    <>
      <input
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
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
          onClick={() => onFilterChange("all")}
        >
          Wszystkie
        </FilterButton>
        <FilterButton
          active={filter === "notDone"}
          onClick={() => onFilterChange("notDone")}
        >
          Do zrobienia
        </FilterButton>
        <FilterButton
          active={filter === "done"}
          onClick={() => onFilterChange("done")}
        >
          Zrobione
        </FilterButton>
      </div>
    </>
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
