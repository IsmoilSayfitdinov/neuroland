import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const days = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
const times = ["9:00", "10:00", "11:00", "12:00", "13:00"];

const schedule = [
  { day: "Dush", items: [
    { time: "9:00", title: "Nutq ...", type: "Nutq" },
    { time: "10:00", title: "Motori...", type: "Motorika" },
    { time: "11:00", title: "Individ...", type: "Individual" },
  ]},
  { day: "Sesh", items: [
    { time: "9:00", title: "Senso...", type: "Sensor" },
    { time: "10:00", title: "Nutq ...", type: "Nutq" },
    { time: "11:00", title: "Kenga...", type: "Individual" },
  ]},
  { day: "Chor", items: [
    { time: "9:00", title: "Nutq ...", type: "Nutq" },
    { time: "10:00", title: "Senso...", type: "Sensor" },
  ]},
  { day: "Pay", items: [
    { time: "9:00", title: "Motori...", type: "Motorika" },
    { time: "11:00", title: "Nutq ...", type: "Nutq" },
  ]},
  { day: "Jum", items: [
    { time: "9:00", title: "Senso...", type: "Sensor" },
    { time: "10:00", title: "Individ...", type: "Individual" },
    { time: "11:00", title: "Nutq ...", type: "Nutq" },
  ]},
  { day: "Shan", items: [
    { time: "9:00", title: "Motori...", type: "Motorika" },
    { time: "11:00", title: "Individ...", type: "Individual" },
  ]},
];

const typeStyles: Record<string, string> = {
  "Nutq": "bg-blue-50 text-blue-600 border-blue-100",
  "Motorika": "bg-[#F0FDFA] text-[#0D9488] border-[#CCFBF1]",
  "Sensor": "bg-orange-50 text-orange-600 border-orange-100",
  "Individual": "bg-slate-50 text-slate-600 border-slate-100",
};

export default function WeeklySchedule() {
  return (
    <Card className="border-none shadow-xs rounded-[40px] bg-white overflow-hidden">
      <CardContent className="p-10">
        <h3 className="text-xl font-bold text-slate-800 mb-10">Haftalik jadval</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-16 text-xs text-slate-400 font-medium pb-4">Vaqt</th>
                {days.map(day => (
                  <th key={day} className="text-sm font-bold text-slate-800 pb-4">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time}>
                  <td className="text-[10px] text-slate-400 font-medium py-3 text-center">{time}</td>
                  {days.map((day) => {
                    const session = schedule.find(s => s.day === day)?.items.find(i => i.time === time);
                    return (
                      <td key={`${day}-${time}`} className="p-0 min-w-[100px]">
                        {session ? (
                          <div className={cn(
                            "h-14 rounded-2xl border flex items-center justify-center text-[10px] font-bold px-2 text-center",
                            typeStyles[session.type]
                          )}>
                            {session.title}
                          </div>
                        ) : (
                          <div className="h-14 rounded-2xl border border-slate-50 bg-[#FDFDFD]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-6 mt-10 ml-8">
          {Object.entries(typeStyles).map(([type, styles]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={cn("w-2.5 h-2.5 rounded-full", styles.split(' ')[0])} />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
