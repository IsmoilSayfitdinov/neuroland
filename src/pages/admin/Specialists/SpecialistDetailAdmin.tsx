import { useMemo } from "react";
import { ChevronLeft, Users, Layers, TrendingUp, Star, Trash2, Edit, Calendar } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { StatCard } from "@/components/admin/ui/StatCard";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { AssignedGroupsTable } from "./components/AssignedGroupsTable";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useSpecialistDetailAdminPage } from "@/hooks/admin/useSpecialistDetailAdminPage";
import { useSessions } from "@/hooks/admin/useSessions";
import { useDiagnostics } from "@/hooks/admin/useDiagnostics";

// Parse shift string → display time
function shiftToTime(shift: string | null | undefined): string {
  if (!shift) return "09:00 — 17:00";
  if (shift.includes("1-smena") || shift.includes("9:00 - 12")) return "09:00 — 12:00";
  if (shift.includes("2-smena") || shift.includes("13:00 - 17")) return "13:00 — 17:00";
  return "09:00 — 17:00";
}

const MONTH_NAMES = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

export default function SpecialistDetailAdmin() {
  const { id } = useParams({ strict: false });
  const {
    spec,
    isLoading,
    isDeleting,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleDelete,
    goBack,
  } = useSpecialistDetailAdminPage();

  const { useSessionsList } = useSessions();
  const { data: allSessions } = useSessionsList();
  const { useResultsList } = useDiagnostics();
  const { data: allDiagResults } = useResultsList();

  // Build bar chart data from real sessions for this specialist (last 4 months)
  const barData = useMemo(() => {
    if (!allSessions) return [];
    const now = new Date();
    const result: { month: string; soni: number }[] = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      const count = allSessions.filter((s) => {
        if (String(s.specialist) !== String(id)) return false;
        const sd = new Date(s.date);
        return sd.getMonth() === monthIdx && sd.getFullYear() === year;
      }).length;
      result.push({ month: MONTH_NAMES[monthIdx], soni: count });
    }
    return result;
  }, [allSessions, id]);

  // Calculate growth % from diagnostics for this specialist's children
  const growthPercent = useMemo(() => {
    if (!allDiagResults || !spec) return null;
    const specResults = allDiagResults.filter((r) => r.specialist === spec.id);
    if (specResults.length < 2) return null;

    const byChild = new Map<number, number[]>();
    specResults.forEach((r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      const existing = byChild.get(r.child) || [];
      existing.push(avg);
      byChild.set(r.child, existing);
    });

    let totalGrowth = 0;
    let count = 0;
    byChild.forEach((scores) => {
      if (scores.length >= 2) {
        const first = scores[0];
        const last = scores[scores.length - 1];
        if (first > 0) {
          totalGrowth += ((last - first) / first) * 100;
          count++;
        }
      }
    });
    return count > 0 ? Math.round(totalGrowth / count) : 0;
  }, [allDiagResults, spec]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="text-center py-20">
        <p className="text-[#9EB1D4]">Mutaxassis topilmadi</p>
        <button onClick={goBack} className="mt-4 text-[#2563EB] font-medium">
          Ro'yxatga qaytish
        </button>
      </div>
    );
  }

  const days = spec.work_days
    ? spec.work_days.split(",").map((d) => d.trim()).filter(Boolean)
    : [];
  const shiftTime = shiftToTime(spec.shift);
  const good = spec.assigned_children_count ? Math.round(spec.assigned_children_count * 0.7) : 0;
  const avg = spec.assigned_children_count ? spec.assigned_children_count - good : 0;
  const totalSessions = barData.reduce((s, d) => s + d.soni, 0);

  return (
    <div className="mx-auto pb-10 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 bg-white border border-gray-200 rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-[#2D3142]" />
          </button>
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#2D3142]">
            Mutaxassis ma'lumotlari
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/specialists/$id/edit"
            params={{ id: String(id) }}
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-bold shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Tahrirlash
          </Link>
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm">
            <Calendar className="w-4 h-4" />
            Jadvalni ko'rish
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-red-100 hover:bg-red-50 text-red-400 rounded-[12px] transition-colors shadow-sm"
            title="O'chirish"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Profile Card ── */}
      <SpecialistProfileCard spec={spec} />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Biriktirilgan bolalar"
          value={String(spec.assigned_children_count)}
          subtitle=""
          icon={Users}
          className="p-6 lg:p-8"
        />
        <StatCard
          title="Faol guruhlar"
          value={String(spec.active_groups_count)}
          subtitle=""
          icon={Layers}
          iconBg="bg-[#E8FFF3]"
          iconColor="text-[#3DB87E]"
          className="p-6 lg:p-8"
        />
        <StatCard
          title="O'rtacha rivojlanish natijasi"
          value={`${spec.average_progress}%`}
          subtitle=""
          icon={TrendingUp}
          iconBg="bg-[#F4ECFF]"
          iconColor="text-[#A855F7]"
          className="p-6 lg:p-8"
        />
        <StatCard
          title="Ota-ona bahosi"
          value={`${spec.parent_rating} / 5`}
          subtitle=""
          icon={Star}
          iconBg="bg-[#FFF4E5]"
          iconColor="text-[#FFB020]"
          className="p-6 lg:p-8"
        />
      </div>

      {/* ── Biriktirilgan guruhlar ── */}
      <AssignedGroupsTable groups={spec.assigned_groups || []} />

      {/* ── Bottom 3-column section ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Ish jadvali */}
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-[#2D3142]">Ish jadvali</h3>
            <Link
              to="/admin/specialists/$id/edit"
              params={{ id: String(id) }}
              className="flex items-center gap-1.5 text-[12px] font-bold text-white bg-[#4D89FF] hover:bg-[#3B7BFF] transition-colors px-3 py-1.5 rounded-[8px]"
            >
              <Calendar className="w-3.5 h-3.5" />
              Jadvalni tahrirlash
            </Link>
          </div>

          {days.length === 0 ? (
            <p className="text-[13px] text-[#9EB1D4]">Jadval belgilanmagan</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {days.map((day) => (
                <div key={day} className="flex items-center justify-between py-3.5">
                  <span className="text-[14px] font-medium text-[#2D3142]">{day}</span>
                  <span className="text-[13px] font-bold text-[#6B7A99]">{shiftTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Oylik mashg'ulotlar soni — Recharts BarChart (real data) */}
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#2D3142] mb-1">Oylik mashg'ulotlar soni</h3>
          <p className="text-[12px] text-[#9EB1D4] mb-4">So'nggi 4 oy</p>

          {barData.length > 0 && totalSessions > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barSize={32} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9EB1D4" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9EB1D4" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F0F5FF" }}
                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
                    formatter={(v: number) => [`${v} ta`, "Mashg'ulot"]}
                  />
                  <Bar dataKey="soni" radius={[6, 6, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={i === barData.length - 1 ? "#2563EB" : "#4D89FF"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#4D89FF]" />
                <span className="text-[12px] text-[#9EB1D4]">Jami: {totalSessions} mashg'ulot</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[280px]">
              <p className="text-[13px] text-[#9EB1D4]">Mashg'ulotlar hali yo'q</p>
            </div>
          )}
        </div>

        {/* Bolalar rivojlanish progressi — Recharts PieChart (donut) */}
        <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
          <h3 className="text-[16px] font-bold text-[#2D3142] mb-1">Bolalar rivojlanish progressi</h3>
          <p className="text-[12px] text-[#9EB1D4] mb-2">O'rtacha ko'rsatkich</p>

          <div className="flex justify-center relative" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: "progress", value: spec.average_progress ?? 0 },
                    { name: "rest", value: 100 - (spec.average_progress ?? 0) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={64}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#4D89FF" />
                  <Cell fill="#F1F5F9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-bold text-[#2D3142]">{spec.average_progress ?? 0}%</span>
              <span className="text-[11px] text-[#9EB1D4]">O'rtacha</span>
            </div>
          </div>

          <div className="space-y-2.5 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4D89FF] shrink-0" />
              <span className="text-[13px] text-[#6B7A99]">Yaxshi: {good}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0] shrink-0" />
              <span className="text-[13px] text-[#6B7A99]">O'rtacha: {avg}</span>
            </div>
            {growthPercent !== null && (
              <p className={`text-[11px] font-medium pt-1 ${growthPercent >= 0 ? "text-[#3DB87E]" : "text-red-400"}`}>
                {growthPercent >= 0 ? "+" : ""}{growthPercent}% o'sish (diagnostika asosida)
              </p>
            )}
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Mutaxassisni o'chirish"
        description={`Haqiqatan ham "${spec.fio}" ni tizimdan o'chirmoqchimisiz? Ushbu amalni qaytarib bo'lmaydi.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
