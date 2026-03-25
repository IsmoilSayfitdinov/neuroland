export interface Task {
  id: number;
  homeTaskId: number; // actual home-task ID for submit API
  title: string;
  category: string;
  subtitle: string;
  status: "confirmed" | "review" | "pending";
  hasWarning?: boolean;
  videoUrl?: string | null;
}

export type TaskStatus = Task["status"];
