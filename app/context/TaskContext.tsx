import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) setTasks(JSON.parse(json));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

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
