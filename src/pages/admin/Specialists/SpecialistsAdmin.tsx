import { Plus, Settings, UserPlus, Search, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SpecialistCard } from "./components/SpecialistCard";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import type { SpecialistOut } from "@/types/specialists.types";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";

const specialistsInfo = (
  <>
    <p>Bu bo'limda markaz mutaxassislarini boshqarish mumkin. Har bir mutaxassis o'z turi va smenasiga ega.</p>
    <p><strong>Asosiy imkoniyatlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>Yangi mutaxassis qo'shish va mavjudlarini tahrirlash</li>
      <li>Mutaxassis turlarini boshqarish (logoped, psixolog va h.k.)</li>
      <li>Ism, tur va smena bo'yicha filtrlash</li>
      <li>Mutaxassisning shaxsiy sahifasi va guruhlari haqida ma'lumot</li>
    </ul>
  </>
);

export default function SpecialistsAdmin() {
  const { useSpecialistsList, useSpecialistTypes } = useSpecialists();
  const { data: specialists, isLoading: isLoadingSpecialists } = useSpecialistsList();
  const { data: types } = useSpecialistTypes();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const shifts = [
    { label: "1-smena", value: "1-smena" },
    { label: "2-smena", value: "2-smena" },
    { label: "Kunlik", value: "Kunlik" },
  ];

  const filtered = useMemo(() => {
    if (!specialists) return [];
    return specialists.filter((s: SpecialistOut) => {
      const matchSearch = !search || s.fio.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || s.specialist_type_id === selectedType;
      const matchShift = !selectedShift || s.shift?.includes(selectedShift);
      return matchSearch && matchType && matchShift;
    });
  }, [specialists, search, selectedType, selectedShift]);

  const hasFilters = search || selectedType || selectedShift;

  const clearFilters = () => {
    setSearch("");
    setSelectedType(null);
    setSelectedShift(null);
  };

  if (isLoadingSpecialists) {
    return (
      <div className="space-y-8">
        <PageHeader title="Mutaxassislar" infoTitle="Mutaxassislar bo'limi" infoContent={specialistsInfo} />
        <CardSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Mutaxassislar"
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/admin/specialists/types"
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-[#2D3142] px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Settings className="w-[18px] h-[18px]" />
              Turlarni boshqarish
            </Link>
            <Link
              to="/admin/specialists/create"
              className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm"
            >
              <Plus className="w-[18px] h-[18px]" />
              Mutaxassis qo'shish
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EB1D4]" />
          <input
            type="text"
            placeholder="Ism bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-4 bg-white border border-gray-200 rounded-[12px] text-[13px] outline-none focus:border-[#4D89FF] focus:shadow-[0_0_0_3px_rgba(77,137,255,0.08)] transition-all placeholder:text-[#9EB1D4]"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`h-[42px] px-4 rounded-[12px] text-[13px] font-medium border transition-all ${
              !selectedType
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-white text-[#6B7A99] border-gray-200 hover:border-gray-300"
            }`}
          >
            Barchasi
          </button>
          {types?.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
              className={`h-[42px] px-4 rounded-[12px] text-[13px] font-medium border transition-all ${
                selectedType === type.id
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-[#6B7A99] border-gray-200 hover:border-gray-300"
              }`}
            >
              {type.title}
            </button>
          ))}
        </div>

        {/* Shift filter */}
        <div className="flex items-center gap-2">
          {shifts.map((s) => (
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
      {specialists && specialists.length > 0 && (
        <p className="text-[13px] text-[#9EB1D4]">
          {filtered.length} ta mutaxassis {hasFilters ? `(${specialists.length} dan)` : ""}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title={hasFilters ? "Natija topilmadi" : "Mutaxassislar topilmadi"}
          description={hasFilters ? "Boshqa filter parametrlarini sinab ko'ring." : "Hozircha hech qanday mutaxassis qo'shilmagan."}
          action={
            hasFilters
              ? { label: "Filterni tozalash", onClick: clearFilters, icon: X }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((spec: SpecialistOut) => (
            <SpecialistCard key={spec?.id} data={spec} />
          ))}
        </div>
      )}
    </div>
  );
}
