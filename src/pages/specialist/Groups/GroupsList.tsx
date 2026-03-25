import { useState, useMemo } from "react";
import { Search, Loader2, Users } from "lucide-react";
import GroupCard from "@/components/specialist/Groups/GroupCard";
import { useGroups } from "@/hooks/admin/useGroups";
import { useSpecialists } from "@/hooks/admin/useSpecialists";
import { CustomSelect } from "@/components/ui/custom-select";
import { PageInfoButton } from "@/components/specialist/PageInfo";
import type { GroupOut } from "@/types/groups.types";

export default function GroupsList() {
  const { useGroupsList } = useGroups();
  const { useSpecialistsList } = useSpecialists();
  const { data: groups, isLoading } = useGroupsList();
  const { data: specialists } = useSpecialistsList();

  const [search, setSearch] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");

  const specialistOptions = useMemo(() => {
    if (!specialists) return [];
    return [
      { label: "Barcha mutaxassislar", value: "" },
      ...specialists.map((s) => ({ label: s.fio, value: s.id.toString() })),
    ];
  }, [specialists]);

  const ageGroupOptions = useMemo(() => {
    if (!groups) return [];
    const unique = [...new Set(groups.map((g) => g.age_group_name).filter(Boolean))];
    return [
      { label: "Barcha darajalar", value: "" },
      ...unique.map((name) => ({ label: name, value: name })),
    ];
  }, [groups]);

  const filtered = useMemo(() => {
    if (!groups) return [];
    return groups.filter((g: GroupOut) => {
      const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
      const matchSpec = !selectedSpecialist || g.specialists?.some((s) => s.id === Number(selectedSpecialist));
      const matchAge = !selectedAgeGroup || g.age_group_name === selectedAgeGroup;
      return matchSearch && matchSpec && matchAge;
    });
  }, [groups, search, selectedSpecialist, selectedAgeGroup]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center gap-2.5">
        <h1 className="text-[24px] font-bold text-[#2D3142]">Guruhlar</h1>
        <PageInfoButton title="Guruhlar">
          <p>Sizga biriktirilgan guruhlar ro'yxati.</p>
          <p><strong>Imkoniyatlar:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Guruh tafsilotlarini ko'rish</li>
            <li>Davomat belgilash va seans boshqarish</li>
            <li>Uy vazifa berish</li>
            <li>Guruh bolalari diagnostikasi</li>
          </ul>
        </PageInfoButton>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9EB1D4]" />
          <input
            type="text"
            placeholder="Guruh qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[42px] pl-10 pr-4 bg-white border border-gray-200 rounded-[12px] text-[13px] outline-none focus:border-[#4D89FF] transition-all placeholder:text-[#9EB1D4]"
          />
        </div>
        <div className="min-w-[200px]">
          <CustomSelect
            options={specialistOptions}
            value={selectedSpecialist}
            onChange={(val) => setSelectedSpecialist(val.toString())}
            placeholder="Barcha mutaxassislar"
            bgBtnColor="bg-white"
          />
        </div>
        <div className="min-w-[180px]">
          <CustomSelect
            options={ageGroupOptions}
            value={selectedAgeGroup}
            onChange={(val) => setSelectedAgeGroup(val.toString())}
            placeholder="Barcha darajalar"
            bgBtnColor="bg-white"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-[#9EB1D4] font-medium">
            {groups?.length === 0 ? "Sizga biriktirilgan guruhlar yo'q" : "Natija topilmadi"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
