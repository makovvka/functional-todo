import { useMemo, useState } from "react";
import { filterTodos, searchTodos, sortTodos } from "../pure/todos";

export function useTodoFilters(todos) {
  const [filter, setFilter] = useState("all");      
  const [searchText, setSearchText] = useState(""); 
  const [sortMode, setSortMode] = useState("newest"); 

  const visibleTodos = useMemo(() => {
    const filtered =
      filter === "all"
        ? todos
        : filter === "done"
        ? filterTodos(todos, true)
        : filterTodos(todos, false);

    const searched = searchTodos(filtered, searchText);
    return sortTodos(searched, sortMode);
  }, [todos, filter, searchText, sortMode]);

  return {
    filter,
    setFilter,
    searchText,
    setSearchText,
    sortMode,
    setSortMode,
    visibleTodos,
  };
}
