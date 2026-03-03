import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const schedule = [
  {
    time: "09:00",
    title: "Guruh A",
    subtitle: "(3-4 yosh)",
    description: "Nutq Terapiyasi",
    type: "group",
  },
  {
    time: "10:30",
    title: "Individual",
    description: "Motorika",
    type: "individual",
  },
  {
    time: "12:00",
    title: "Mini guruh",
    subtitle: "(1-2 yosh)",
    description: "Kognitiv",
    type: "mini-group",
  },
  {
    time: "14:00",
    title: "Individual",
    description: "Sensorika",
    type: "individual",
  },
];

export default function TodaySchedule() {
  return (
    <Card className="h-full min-h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-800">Bugungi Jadval</CardTitle>
        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
          4 ta seans
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <div className="text-sm font-bold text-slate-800">{item.time}</div>
                <div className="text-[10px] text-slate-400 mt-1">🕒</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-800">{item.title}</span>
                  {item.subtitle && <span className="text-xs text-slate-400 font-medium">{item.subtitle}</span>}
                </div>
                <div className="bg-white/80 border px-2 py-0.5 rounded-lg text-[10px] text-emerald-600 font-medium mt-1 inline-block">
                  {item.description}
                </div>
              </div>
            </div>
            <Button className="bg-[#2ECC71] hover:bg-emerald-600 text-white rounded-xl h-10 px-4 flex items-center gap-2 text-xs font-bold">
              <Play className="w-3 h-3 fill-current" />
              Seansni boshlash
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
