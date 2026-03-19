import { CheckCircle2, Circle, Star, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useHomeTasks } from "@/hooks/parent/useHomeTasks";

export default function TodayTasks() {
  const { data: homeTasks } = useHomeTasks();

  const tasks = (homeTasks || [])
    .flatMap((task) =>
      (task.items || []).map((item) => ({
        id: item.id,
        title: item.title,
        category: task.specialist_name || "Mashq",
        duration: task.due_date,
        status:
          task.status === "approved"
            ? "done"
            : task.status === "submitted"
            ? "review"
            : "pending",
        points: item.xp_reward || 10,
      }))
    )
    .slice(0, 3);

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const totalPoints = tasks.reduce((acc, t) => acc + t.points, 0);

  // Show skeleton / placeholder if no data yet
  const displayTasks = tasks.length
    ? tasks
    : [
        { id: 1, title: "Ranglar bilan tanishish", category: "Logoped",  duration: "5 min", status: "pending", points: 10 },
        { id: 2, title: "Go'l baroqlari mashqi",  category: "Motorika", duration: "6 min", status: "pending", points: 10 },
        { id: 3, title: "Hayvon ovozlari o'yini", category: "Body",     duration: "5 min", status: "pending", points: 20 },
      ];

  const displayDone   = tasks.length ? doneCount   : 0;
  const displayTotal  = displayTasks.length;
  const displayPoints = tasks.length ? totalPoints : 15;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="font-bold text-[#222939] text-[18px]">Bugungi mashg'ulotlar</h2>
          <p className="text-[12px] text-[#768093] mt-[2px]">
            {displayDone}/{displayTotal} bajarildi · Davom eting 🔥
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FEF9C3] px-3 py-1.5 rounded-xl">
            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-[13px] font-bold text-[#92400E]">{displayPoints} ball</span>
          </div>
          <Link
            to="/parent/tasks"
            className="text-[12px] font-bold text-[#4D89FF] bg-[#EEF4FF] px-3 py-1.5 rounded-xl hover:bg-[#dce9ff] transition-colors"
          >
            Hammasi
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[6px] bg-gray-100 rounded-full overflow-hidden mb-4 mt-3">
        <div
          className="h-full bg-[#3B82F6] transition-all duration-500 rounded-full"
          style={{ width: `${displayTotal > 0 ? (displayDone / displayTotal) * 100 : 0}%` }}
        />
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {displayTasks.map((task, i) => {
          const isDone   = task.status === "done";
          const isReview = task.status === "review";

          const categoryColor =
            task.category === "Logoped"  ? { bg: "#EEF4FF", text: "#2563EB" } :
            task.category === "Motorika" ? { bg: "#F0FDF4", text: "#16A34A" } :
            task.category === "Body"     ? { bg: "#FFF7ED", text: "#EA580C" } :
                                           { bg: "#F3F4F6", text: "#6B7280" };

          return (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-[16px] border border-gray-50 shadow-sm"
            >
              {/* Status icon */}
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : isReview ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#3B82F6] flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-gray-200 shrink-0" />
              )}

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-bold leading-tight ${isDone ? "text-[#9EB1D4] line-through" : "text-[#1E293B]"}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                  >
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#9EB1D4]">
                    <Clock className="w-3 h-3" />
                    {task.duration}
                  </span>
                </div>
              </div>

              {/* Points */}
              <div className="flex items-center gap-1 shrink-0 bg-[#FEF9C3] px-2.5 py-1 rounded-xl">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-[12px] font-bold text-[#92400E]">+{task.points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
