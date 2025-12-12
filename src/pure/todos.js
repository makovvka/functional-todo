// src/pure/todos.js

// Tworzy nowe zadanie – czysta funkcja
// priority jest opcjonalne, domyślnie "normal"
export function createTodo(id, text, priority = "normal") {
  return {
    id,
    text: text.trim(),
    done: false,
    priority,
  };
}

// Dodaje zadanie do listy – nie modyfikuje oryginalnej tablicy
export function addTodo(list, todo) {
  return [...list, todo];
}

// Przełącza status "done" – czysta funkcja
export function toggleTodo(list, id) {
  return list.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item
  );
}

// Usuwa zadanie – zwraca nową tablicę
export function removeTodo(list, id) {
  return list.filter((item) => item.id !== id);
}

// Aktualizuje tekst zadania
export function updateTodoText(list, id, newText) {
  const text = newText.trim();
  if (!text) return list; // brak zmian jeśli puste
  return list.map((item) =>
    item.id === id ? { ...item, text } : item
  );
}

// Zmiana priorytetu zadania
export function changePriority(list, id, priority) {
  return list.map((item) =>
    item.id === id ? { ...item, priority } : item
  );
}

// Filtr po statusie done – czysta funkcja
export function filterTodos(list, showDone) {
  if (showDone === null) return list;
  return list.filter((item) => item.done === showDone);
}

// Szukanie po treści zadania – czysta funkcja
export function searchTodos(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => t.text.toLowerCase().includes(q));
}

// Sortowanie listy zadań wg trybu
// mode: "newest" | "oldest" | "undoneFirst"
export function sortTodos(list, mode) {
  const copy = [...list]; // nie modyfikujemy oryginału

  if (mode === "newest") {
    return copy.sort((a, b) => b.id - a.id); // zakładamy, że id = timestamp
  }

  if (mode === "oldest") {
    return copy.sort((a, b) => a.id - b.id);
  }

  if (mode === "undoneFirst") {
    return copy.sort((a, b) => {
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1; // najpierw niezrobione
    });
  }

  return list;
}

// Usuwa wszystkie zrobione zadania
export function clearDone(list) {
  return list.filter((t) => !t.done);
}

// Oznacza wszystkie zadania jako zrobione
export function markAllDone(list) {
  return list.map((t) => (t.done ? t : { ...t, done: true }));
}

// Proste statystyki – też czysta funkcja
export function getStats(list) {
  const total = list.length;
  const done = list.filter((t) => t.done).length;
  const notDone = total - done;
  return { total, done, notDone };
}

// Wygodna funkcja do obliczania procentu postępu
export function getProgress(stats) {
  return stats.total === 0
    ? 0
    : Math.round((stats.done / stats.total) * 100);
}

// Serializacja / deserializacja – nadal czyste funkcje
export function serializeTodos(list) {
  return JSON.stringify(list);
}

export function deserializeTodos(json) {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];

    // Minimalne zabezpieczenie struktury
    return parsed.map((item, index) => ({
      id: item.id ?? index,
      text: String(item.text ?? "").trim(),
      done: Boolean(item.done),
      priority: item.priority ?? "normal",
    }));
  } catch {
    return [];
  }
}
