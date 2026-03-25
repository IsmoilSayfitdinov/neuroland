import { Plus, Search, X, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { GroupCard } from "./components/GroupCard";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useGroups } from "@/hooks/admin/useGroups";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import type { GroupOut, GroupStatus } from "@/types/groups.types";

const STATUS_OPTIONS: { label: string; value: GroupStatus }[] = [
  { label: "Faol", value: "active" },
  { label: "Yangi", value: "new" },
  { label: "Diagnostika", value: "diagnostika" },
  { label: "Tugallangan", value: "completed" },
  { label: "Arxiv", value: "archive" },
];

const SHIFT_OPTIONS = [
  { label: "Ertalab", value: "morning" },
  { label: "Kunduzi", value: "afternoon" },
  { label: "Kechqurun", value: "evening" },
];

const groupsInfo = (
  <>
    <p>Bu bo'limda barcha guruhlarni boshqarish mumkin. Har bir guruhda bolalar biriktirilgan bo'lib, o'z jadvaliga ega.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi guruh yaratish va mavjudlarini tahrirlash</li>
      <li>Holat, smena bo'yicha filtrlash</li>
      <li>Guruh tarkibidagi bolalar ro'yxatini ko'rish</li>
      <li>Guruh jadvali va oylik rejalarni boshqarish</li>
    </ul>
  </>
);

export default function AdminGroupsList() {
  const { useGroupsList } = useGroups();
  const { data: groups, isLoading } = useGroupsList();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<GroupStatus | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!groups) return [];
    return groups.filter((g: GroupOut) => {
      const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !selectedStatus || g.status === selectedStatus;
      const matchShift = !selectedShift || g.shift === selectedShift;
      return matchSearch && matchStatus && matchShift;
    });
  }, [groups, search, selectedStatus, selectedShift]);

  const hasFilters = search || selectedStatus || selectedShift;

  const clearFilters = () => {
    setSearch("");
    setSelectedStatus(null);
    setSelectedShift(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Guruhlar"
          infoTitle="Guruhlar bo'limi"
          infoContent={groupsInfo}
          action={
            <div className="w-[140px] h-10 bg-[#F1F5F9] animate-pulse rounded-[12px]" />
          }
        />
        <CardSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Guruhlar"
        action={
          <Link
            to="/admin/groups/create"
            className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
          >
            <Plus className="w-[18px] h-[18px]" />
            Guruh qo'shish
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EB1D4]" />
          <input
            type="text"
            placeholder="Guruh nomi bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-4 bg-white border border-gray-200 rounded-[12px] text-[13px] outline-none focus:border-[#4D89FF] focus:shadow-[0_0_0_3px_rgba(77,137,255,0.08)] transition-all placeholder:text-[#9EB1D4]"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`h-[42px] px-4 rounded-[12px] text-[13px] font-medium border transition-all ${
              !selectedStatus
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-white text-[#6B7A99] border-gray-200 hover:border-gray-300"
            }`}
          >
            Barchasi
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(selectedStatus === s.value ? null : s.value)}
              className={`h-[42px] px-4 rounded-[12px] text-[13px] font-medium border transition-all ${
                selectedStatus === s.value
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-[#6B7A99] border-gray-200 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Shift filter */}
        <div className="flex items-center gap-2">
          {SHIFT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedShift(selectedShift === s.value ? null : s.value)}
              className={`h-[42px] px-4 rounded-[12px] text-[13px] font-medium border transition-all ${
                selectedShift === s.value
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-[#6B7A99] border-gray-200 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="h-[42px] px-3 flex items-center gap-1.5 text-[13px] font-medium text-red-500 hover:bg-red-50 rounded-[12px] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Tozalash
          </button>
        )}
      </div>

      {/* Count */}
      {groups && groups.length > 0 && (
        <p className="text-[13px] text-[#9EB1D4]">
          {filtered.length} ta guruh {hasFilters ? `(${groups.length} dan)` : ""}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={hasFilters ? "Natija topilmadi" : "Guruhlar mavjud emas"}
          description={
            hasFilters
              ? "Boshqa filter parametrlarini sinab ko'ring."
              : "Hozircha hech qanday guruh yaratilmagan."
          }
          action={
            hasFilters
              ? { label: "Filterni tozalash", onClick: clearFilters, icon: X }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups &&
            filtered.map((group: GroupOut) => (
              <GroupCard key={group.id} data={group} />
            ))}
        </div>
      )}
    </div>
  );
}
