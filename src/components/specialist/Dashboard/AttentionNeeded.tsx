import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Props {
  apiData?: any[];
}

export default function AttentionNeeded({ apiData }: Props) {
  const items = apiData ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-800">E'tibor talab qiladi</CardTitle>
        {items.length > 0 && (
          <div className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
            {items.length}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-[13px] text-slate-400">Hozircha ogohlantirish yo'q</div>
        ) : (
          items.map((item: any, i: number) => (
            <div key={i} className="bg-amber-50 rounded-2xl p-4 flex items-center gap-4 border border-transparent">
              <div className="w-1 h-12 bg-amber-500 rounded-full" />
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800">{item.child_name || item.title || "Ogohlantirish"}</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message || item.reason || item.description || ""}</div>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
