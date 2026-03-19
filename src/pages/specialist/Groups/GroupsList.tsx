import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/specialist/Groups/GroupCard";
import { useGroups } from "@/hooks/admin/useGroups";

export default function GroupsList() {
  const { useGroupsList } = useGroups();
  const { data: groups, isLoading, isError } = useGroupsList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200 px-10">
          <p className="text-slate-500 font-bold">Guruhlarni yuklashda xatolik yuz berdi</p>
          <p className="text-slate-400 text-sm mt-1">Sahifani yangilang yoki qayta urinib ko'ring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Guruhlar</h1>
        <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold shadow-lg shadow-blue-100">
          <Plus size={20} />
          Yangi guruh yaratish
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-white border border-slate-100 px-4 py-3 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
          <Filter size={18} />
        </div>
        <div className="flex-1 min-w-[150px] bg-white border border-slate-100 px-6 py-3 rounded-xl text-sm font-bold text-slate-500 text-center sm:text-left">
          Barcha mutaxassislar
        </div>
        <div className="flex-1 min-w-[150px] bg-white border border-slate-100 px-6 py-3 rounded-xl text-sm font-bold text-slate-500 text-center sm:text-left">
          Barcha darajalar
        </div>
      </div>

      {groups?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">Sizga biriktirilgan guruhlar hozircha yo'q</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
        {groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}
