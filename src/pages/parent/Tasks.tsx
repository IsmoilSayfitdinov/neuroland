import TaskProgress from "@/components/parent/Tasks/TaskProgress";
import TaskCard from "@/components/parent/Tasks/TaskCard";
import type { Task } from "@/components/parent/Tasks/types";
import { useHomeTasks } from "@/hooks/parent/useHomeTasks";
import { Loader2 } from "lucide-react";

export default function TasksPage() {
  const { data: homeTasks, isLoading } = useHomeTasks();

  const tasks: Task[] = (homeTasks || []).flatMap((task) =>
    (task.items || []).map((item) => ({
      id: item.id,
      homeTaskId: task.id,
      title: item.title,
      category: task.specialist_name || "Mashq",
      subtitle: `Muddati: ${task.due_date}`,
      status:
        task.status === "approved"
          ? "confirmed"
          : task.status === "submitted"
          ? "review"
          : "pending",
      hasWarning: task.status === "rejected",
    }))
  );

  const completedCount = tasks.filter((t) => t.status === "confirmed").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Vazifalar</h1>

      <TaskProgress completedCount={completedCount} totalCount={tasks.length} />

      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[24px] border border-dashed border-gray-200">
            <p className="text-[#9EB1D4] font-medium">Hozircha vazifalar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}
