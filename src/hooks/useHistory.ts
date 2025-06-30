import { useState, useRef } from "react";

export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [pointer, setPointer] = useState(0);
  const isUpdatingFromHistory = useRef(false);

  const setState = (newState: T) => {
    if (isUpdatingFromHistory.current) {
      isUpdatingFromHistory.current = false;
      return;
    }
    setHistory((prev) => {
      const updated = prev.slice(0, pointer + 1);
      updated.push(newState);
      return updated;
    });
    setPointer((p) => p + 1);
  };

  const undo = () => {
    if (pointer > 0) {
      isUpdatingFromHistory.current = true;
      setPointer((p) => p - 1);
    }
  };

  const redo = () => {
    if (pointer < history.length - 1) {
      isUpdatingFromHistory.current = true;
      setPointer((p) => p + 1);
    }
  };

  return {
    state: history[pointer],
    setState,
    undo,
    redo,
    canUndo: pointer > 0,
    canRedo: pointer < history.length - 1,
  };
};
