import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DiagnosticsAPI } from "@/api/diagnostics.api";
import { GROUP_STATUS_LABELS } from "@/constants/groups";
import { cn } from "@/lib/utils";
import type { GroupOut } from "@/types/groups.types";

interface GroupCardProps {
  group: GroupOut;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { id, name, age_group_name, specialists, children_count, max_children, status } = group;
  const specialistName = specialists?.[0]?.fio || "Tayinlanmagan";
  const statusCfg = GROUP_STATUS_LABELS[status] ?? GROUP_STATUS_LABELS.active;

  // Fetch diagnostics for this group's children to compute progress
  const childIds = group.children?.map((c) => c.id) || [];
  const { data: diagnosticResults } = useQuery({
    queryKey: ["diagnostics", "group-progress", id],
    queryFn: () => DiagnosticsAPI.getResults(),
    enabled: childIds.length > 0,
  });

  const avgProgress = (() => {
    if (!diagnosticResults?.length || !childIds.length) return 0;
    const groupResults = diagnosticResults.filter((r) => childIds.includes(r.child));
    if (!groupResults.length) return 0;
    const total = groupResults.reduce((acc, r) => {
      const avg = r.answers.length > 0
        ? r.answers.reduce((s, a) => s + a.score, 0) / r.answers.length
        : 0;
      return acc + avg;
    }, 0);
    return Math.round((total / groupResults.length) * 100);
  })();

  return (
    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-[24px] bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6 gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-base truncate">{name}</h3>
              <span className="shrink-0 text-[10px] text-slate-400 font-medium tracking-tight">({age_group_name})</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{specialistName}</p>
          </div>
          <span className={cn("shrink-0 text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest flex items-center gap-1.5", statusCfg.cls)}>
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {statusCfg.label}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-slate-400" />
              <span>Bolalar</span>
            </div>
            <span className="font-bold text-slate-800 text-sm">{children_count}/{max_children}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-slate-400" />
                <span>O'rtacha progress</span>
              </div>
              <span className="font-bold text-slate-800 text-sm">{avgProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${avgProgress}%` }} />
            </div>
          </div>
        </div>

        <Link to="/specialist/groups/$groupId" params={{ groupId: String(id) }} className="w-full">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl text-white font-bold text-sm shadow-md shadow-blue-100">
            Guruhni ko'rish
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
