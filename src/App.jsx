import { useState } from "react";
import { useTodosStore } from "./hooks/useTodosStore";
import { useTodoFilters } from "./hooks/useTodoFilters";
import { useImportExport } from "./hooks/useImportExport";
import { useStats } from "./hooks/useStats";

import { StatsBar } from "./components/StatsBar";
import { TodoForm } from "./components/TodoForm";
import { TodoFilters } from "./components/TodoFilters";
import { TodoBulkActions } from "./components/TodoBulkActions";
import { UndoRedoBar } from "./components/UndoRedoBar";
import { ImportExportSection } from "./components/ImportExportSection";
import { TodoList } from "./components/TodoList";

function App() {
  const {
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
  } = useTodosStore();

  const {
    filter,
    setFilter,
    searchText,
    setSearchText,
    sortMode,
    setSortMode,
    visibleTodos,
  } = useTodoFilters(todos);

  const stats = useStats(todos);

  const {
    isExportOpen,
    exportText,
    openExport,
    closeExport,
    isImportOpen,
    importText,
    setImportText,
    importError,
    openImport,
    cancelImport,
    confirmImport,
  } = useImportExport(todos, replaceAll);

  const [text, setText] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    add(text, newPriority);
    setText("");
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
    updateText(id, editingText);
    setEditingId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

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

        <TodoForm
          text={text}
          onTextChange={setText}
          priority={newPriority}
          onPriorityChange={setNewPriority}
          onSubmit={handleAdd}
        />

        <TodoFilters
          filter={filter}
          onFilterChange={setFilter}
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />

        <TodoBulkActions
          onMarkAllAsDone={markAllAsDone}
          onClearDone={clearDoneTodos}
        />

        <UndoRedoBar
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
        />

        <ImportExportSection
          isExportOpen={isExportOpen}
          exportText={exportText}
          openExport={openExport}
          closeExport={closeExport}
          isImportOpen={isImportOpen}
          importText={importText}
          setImportText={setImportText}
          importError={importError}
          openImport={openImport}
          cancelImport={cancelImport}
          confirmImport={confirmImport}
        />

        <TodoList
          todos={visibleTodos}
          editingId={editingId}
          editingText={editingText}
          onEditingTextChange={setEditingText}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onToggle={toggle}
          onRemove={remove}
          onPriorityChange={setPriority}
        />
      </div>
    </div>
  );
}

export default App;
