import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import GroupCard from "@/components/specialist/Groups/GroupCard";

const groups = [
  { id: "1", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "2", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "3", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "4", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "5", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "6", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "7", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "8", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
];

export default function GroupsList() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">Guruhlar</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg shadow-blue-100">
          <Plus size={20} />
          Yangi guruh yaratish
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-white border border-slate-100 px-4 py-3 rounded-xl flex items-center gap-2 text-slate-400">
          <Filter size={18} />
        </div>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-xl text-sm font-bold text-slate-500">
          Barcha mutaxassislar
        </div>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-xl text-sm font-bold text-slate-500">
          Barcha darajalar
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-2">
        {groups.map((group) => (
          <GroupCard key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
}
