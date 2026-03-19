import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GroupCard } from "./components/GroupCard";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useGroups } from "@/hooks/admin/useGroups";
import { CardSkeleton } from "@/components/admin/ui/CardSkeleton";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Users } from "lucide-react";

export default function AdminGroupsList() {
  const { useGroupsList } = useGroups();
  const { data: groups, isLoading } = useGroupsList();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader 
          title="Guruhlar" 
          action={
            <div className="w-[140px] h-10 bg-[#F1F5F9] animate-pulse rounded-[12px]" />
          } 
        />
        <CardSkeleton count={8} />
      </div>
    );
  }

  

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader 
        title="Guruhlar" 
        action={
          <Link to="/admin/groups/create" className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors text-white px-5 py-2.5 rounded-[12px] text-[14px] font-medium shadow-sm">
            <Plus className="w-[18px] h-[18px]" />
            Guruh qo'shish
          </Link>
        } 
      />

      {/* Empty State */}
      {groups?.length === 0 && (
        <EmptyState 
          icon={Users}
          title="Guruhlar mavjud emas"
          description="Hozircha hech qanday guruh yaratilmagan. Yangi guruh qo'shish uchun yuqoridagi tugmani bosing."
        />
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups?.map((group) => (
          <GroupCard key={group.id} data={group} />
        ))}
      </div>
    </div>
  );
}
