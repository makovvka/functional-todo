export function createTodo(id, text, priority = "normal") {
  return {
    id,
    text: text.trim(),
    done: false,
    priority,
  };
}

export function addTodo(list, todo) {
  return [...list, todo];
}

export function toggleTodo(list, id) {
  return list.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item
  );
}

export function removeTodo(list, id) {
  return list.filter((item) => item.id !== id);
}

export function updateTodoText(list, id, newText) {
  const text = newText.trim();
  if (!text) return list; 
  return list.map((item) =>
    item.id === id ? { ...item, text } : item
  );
}

export function filterTodos(list, showDone) {
  if (showDone === null) return list;
  return list.filter((item) => item.done === showDone);
}

export function getStats(list) {
  const total = list.length;
  const done = list.filter((t) => t.done).length;
  const notDone = total - done;
  return { total, done, notDone };
}

export function serializeTodos(list) {
  return JSON.stringify(list);
}

export function deserializeTodos(json) {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];

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

export function clearDone(list) {
  return list.filter((t) => !t.done);
}

export function markAllDone(list) {
  return list.map((t) => (t.done ? t : { ...t, done: true }));
}

export function searchTodos(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) => t.text.toLowerCase().includes(q));
}


export function sortTodos(list, mode) {
  const copy = [...list]; 

  if (mode === "newest") {
    return copy.sort((a, b) => b.id - a.id); 
  }

  if (mode === "oldest") {
    return copy.sort((a, b) => a.id - b.id);
  }

  if (mode === "undoneFirst") {
    return copy.sort((a, b) => {
      if (a.done === b.done) return 0;
      return a.done ? 1 : -1; 
    });
  }

  return list;
}

export function changePriority(list, id, priority) {
  return list.map((item) =>
    item.id === id ? { ...item, priority } : item
  );
}
