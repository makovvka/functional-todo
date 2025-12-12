import { useState } from "react";
import { serializeTodos, deserializeTodos } from "../pure/todos";

export function useImportExport(todos, onImport) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportText, setExportText] = useState("");

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  const openExport = () => {
    setExportText(serializeTodos(todos));
    setIsExportOpen(true);
  };

  const closeExport = () => {
    setIsExportOpen(false);
  };

  const openImport = () => {
    setImportText("");
    setImportError("");
    setIsImportOpen(true);
  };

  const cancelImport = () => {
    setIsImportOpen(false);
    setImportText("");
    setImportError("");
  };

  const confirmImport = () => {
    const list = deserializeTodos(importText);
    if (list.length === 0 && importText.trim().length > 0) {
      setImportError("Nie udało się wczytać danych. Sprawdź JSON.");
      return;
    }
    onImport(list);
    setIsImportOpen(false);
    setImportError("");
  };

  return {
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
  };
}
