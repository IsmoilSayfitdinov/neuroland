import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const alerts = [
  {
    name: "Akmal Karimov",
    message: "Nutq yo'nalishi bo'yicha regressiya aniqlandi",
    time: "1 soat oldin",
    color: "bg-red-50",
    accent: "bg-red-500",
  },
  {
    name: "Sardor Umarov",
    message: "Uy vazifasi 3 kun davomida bajarilmagan",
    time: "2 soat oldin",
    color: "bg-amber-50",
    accent: "bg-amber-500",
  },
  {
    name: "Dilnoza Sharipova",
    message: "Ota-ona video darslarni ko'rdi",
    time: "3 soat oldin",
    color: "bg-blue-50",
    accent: "bg-blue-500",
  },
];

export default function AttentionNeeded() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">E'tibor talab qiladi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`${alert.color} rounded-2xl p-4 flex items-center justify-between border border-transparent`}>
            <div className="flex gap-4">
              <div className={`w-1 h-12 ${alert.accent} rounded-full`} />
              <div>
                <div className="text-sm font-bold text-slate-800">{alert.name}</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[200px]">{alert.message}</div>
                <div className="text-[10px] text-slate-400 mt-2">{alert.time}</div>
              </div>
            </div>
            <Button variant="ghost" className="bg-white hover:bg-white/80 rounded-xl text-xs font-bold text-slate-800 shadow-sm px-4 h-9">
              Ko'rib chiqish
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
