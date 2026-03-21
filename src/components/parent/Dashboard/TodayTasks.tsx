import { CheckCircle2, Circle, Star, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ParentDashboard } from "@/types/analytics.types";

interface Props {
  apiData?: ParentDashboard["today_tasks"] | null;
}

export default function TodayTasks({ apiData }: Props) {
  const tasks = (apiData?.tasks || []).map((t: any) => ({
    id: t.id,
    title: t.title || t.exercise_name || "Mashq",
    category: t.specialist_name || t.section_name || "Mashq",
    duration: t.due_date || "",
    status: t.status === "approved" ? "done" : t.status === "submitted" ? "review" : "pending",
    points: t.xp_reward || 10,
  }));

  const doneCount = apiData?.completed ?? 0;
  const totalCount = apiData?.total ?? tasks.length;
  const totalPoints = tasks.reduce((acc: number, t: any) => acc + t.points, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="font-bold text-[#222939] text-[18px]">Bugungi mashg'ulotlar</h2>
          <p className="text-[12px] text-[#768093] mt-[2px]">
            {doneCount}/{totalCount} bajarildi · Davom eting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FEF9C3] px-3 py-1.5 rounded-xl">
            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-[13px] font-bold text-[#92400E]">{totalPoints} ball</span>
          </div>
          <Link to="/parent/tasks" className="text-[12px] font-bold text-[#4D89FF] bg-[#EEF4FF] px-3 py-1.5 rounded-xl hover:bg-[#dce9ff] transition-colors">
            Hammasi
          </Link>
        </div>
      </div>

      <div className="h-[6px] bg-gray-100 rounded-full overflow-hidden mb-4 mt-3">
        <div className="h-full bg-[#3B82F6] transition-all duration-500 rounded-full"
          style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }} />
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center text-[13px] text-[#9EB1D4]">Bugungi mashg'ulotlar mavjud emas</div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task: any, i: number) => {
            const isDone = task.status === "done";
            const isReview = task.status === "review";
            const categoryColor =
              task.category === "Logoped" ? { bg: "#EEF4FF", text: "#2563EB" } :
              task.category === "Motorika" ? { bg: "#F0FDF4", text: "#16A34A" } :
              { bg: "#F3F4F6", text: "#6B7280" };

            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-[16px] border border-gray-50 shadow-sm">
                {isDone ? <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" /> :
                 isReview ? <div className="w-5 h-5 rounded-full border-2 border-[#3B82F6] flex items-center justify-center shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /></div> :
                 <Circle className="w-5 h-5 text-gray-200 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-bold leading-tight ${isDone ? "text-[#9EB1D4] line-through" : "text-[#1E293B]"}`}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}>{task.category}</span>
                    {task.duration && <span className="flex items-center gap-1 text-[11px] text-[#9EB1D4]"><Clock className="w-3 h-3" />{task.duration}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-[#FEF9C3] px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[12px] font-bold text-[#92400E]">+{task.points}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
