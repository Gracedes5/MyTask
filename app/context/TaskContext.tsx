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
  resetTasks: () => void;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be inside TaskProvider");
  return ctx;
};

const STORAGE_KEY = StorageKeys.TASKS;

function normalizeStoredTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const normalized: Task[] = [];

  value.forEach((item, index) => {
    if (!item || typeof item !== "object") return;

    const raw = item as Record<string, unknown>;
    const title = typeof raw.title === "string" ? raw.title : "";
    if (!title.trim()) return;

    let id =
      typeof raw.id === "string" && raw.id.trim()
        ? raw.id
        : `legacy-${Date.now()}-${index}`;
    if (seen.has(id)) id = `${id}-${index}`;
    seen.add(id);

    normalized.push({
      id,
      title,
      description:
        typeof raw.description === "string" ? raw.description : "",
      day: typeof raw.day === "string" ? raw.day : "",
      time: typeof raw.time === "string" ? raw.time : "",
      done: raw.done === true,
      ...(typeof raw.completedAt === "string"
        ? { completedAt: raw.completedAt }
        : {}),
      ...(typeof raw.note === "string" ? { note: raw.note } : {}),
    });
  });

  return normalized;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const tasksRef = useRef<Task[]>([]);
  const loadFailedRef = useRef(false);
  const idCounterRef = useRef(0);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let mounted = true;

    storage
      .getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;

        if (!raw) {
          setTasks([]);
          tasksRef.current = [];
          return;
        }

        try {
          const restored = normalizeStoredTasks(JSON.parse(raw));
          setTasks(restored);
          tasksRef.current = restored;
        } catch (error) {
          loadFailedRef.current = true;
          console.warn("Failed to restore tasks", error);
        }
      })
      .catch((error) => {
        loadFailedRef.current = true;
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
    if (!loaded || loadFailedRef.current) return;
    storage.setJSON(STORAGE_KEY, tasks).catch((error) =>
      console.warn("Failed to save tasks", error),
    );
  }, [tasks, loaded]);

  useEffect(() => {
    if (!loaded || loadFailedRef.current) return;

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        storage
          .setJSON(STORAGE_KEY, tasksRef.current)
          .catch((error) => console.warn("Failed to save tasks", error));
      }
    });

    return () => subscription.remove();
  }, [loaded]);

  const createId = useCallback(() => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}`;
  }, []);

  const addTask = useCallback(
    (t: Omit<Task, "id" | "done">) => {
      setTasks((prev) => [...prev, { ...t, id: createId(), done: false }]);
    },
    [createId],
  );

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

  const resetTasks = useCallback(() => {
    setTasks([]);
    tasksRef.current = [];
    loadFailedRef.current = false;
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
      resetTasks,
    }),
    [
      tasks,
      addTask,
      toggleDone,
      editTask,
      deleteTask,
      updateTaskNote,
      resetTasks,
    ],
  );

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
}
