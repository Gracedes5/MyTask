import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

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

const STORAGE_KEY = "tasks";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (!mounted || !json) return;
        const stored = JSON.parse(json);
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((error) =>
      console.warn("Failed to save tasks", error),
    );
  }, [tasks, loaded]);

  useEffect(() => {
    if (!loaded) return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(tasksRef.current),
        ).catch((error) => console.warn("Failed to save tasks", error));
      }
    });

    return () => subscription.remove();
  }, [loaded]);

  const addTask = (t: Omit<Task, "id" | "done">) =>
    setTasks((prev) => [
      ...prev,
      { ...t, id: Date.now().toString(), done: false },
    ]);

  const toggleDone = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : undefined }
          : t,
      ),
    );

  const editTask = (id: string, updates: Partial<Omit<Task, "id">>) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const updateTaskNote = (id: string, note: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, note } : t)),
    );

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleDone, editTask, deleteTask, updateTaskNote }}>
      {children}
    </TaskContext.Provider>
  );
}
