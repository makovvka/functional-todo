import { useMemo } from "react";
import { getStats, getProgress } from "../pure/todos";

export function useStats(todos) {
  return useMemo(() => {
    const stats = getStats(todos);
    const progress = getProgress(stats);
    return { ...stats, progress };
  }, [todos]);
}
