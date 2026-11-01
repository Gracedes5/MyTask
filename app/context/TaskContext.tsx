import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { storage, StorageKeys } from "../../utils/storage";

export type Task = {
  id: string;
  title: string;
  description: string;
  day: string;
  time: string;
  done: boolean;
  completedAt?: string;
  note?: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (t: Omit<Task, "id" | "done">) => void;
  toggleDone: (id: string) => void;
  editTask: (id: string, updates: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  updateTaskNote: (id: string, note: string) => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be inside TaskProvider");
  return ctx;
};

const STORAGE_KEY = StorageKeys.TASKS;

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let mounted = true;

    storage
      .getJSON<Task[]>(STORAGE_KEY, [])
      .then((stored) => {
        if (!mounted) return;
        if (Array.isArray(stored)) {
          setTasks(stored);
          tasksRef.current = stored;
        }
      })
      .catch((error) => {
        console.warn("Failed to restore tasks", error);
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    storage.setJSON(STORAGE_KEY, tasks).catch((error) =>
      console.warn("Failed to save tasks", error),
    );
  }, [tasks, loaded]);

  useEffect(() => {
    if (!loaded) return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        storage
          .setJSON(STORAGE_KEY, tasksRef.current)
          .catch((error) => console.warn("Failed to save tasks", error));
      }
    });

    return () => subscription.remove();
  }, [loaded]);

  const addTask = useCallback((t: Omit<Task, "id" | "done">) => {
    setTasks((prev) => [
      ...prev,
      { ...t, id: Date.now().toString(), done: false },
    ]);
  }, []);

  const toggleDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : undefined }
          : t,
      ),
    );
  }, []);

  const editTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id">>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    [],
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTaskNote = useCallback((id: string, note: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, note } : t)),
    );
  }, []);

  // Keep the context value stable unless tasks or an action actually changes.
  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleDone,
      editTask,
      deleteTask,
      updateTaskNote,
    }),
    [tasks, addTask, toggleDone, editTask, deleteTask, updateTaskNote],
  );

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
}
