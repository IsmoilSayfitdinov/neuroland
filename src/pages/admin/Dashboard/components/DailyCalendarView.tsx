import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const days = ["Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
const times = ["9:00", "10:00", "11:00", "12:00", "13:00"];

type ActivityType = "Nutq" | "Motorika" | "Sensor" | "Individual";

interface ScheduleBlock {
  title: string;
  type: ActivityType;
  isCompleted?: boolean;
}

// Map matrix [timeIndex][dayIndex]
const scheduleData: Record<number, Record<number, ScheduleBlock>> = {
  0: { // 9:00
    0: { title: "Nutq ...", type: "Nutq", isCompleted: true },
    1: { title: "Senso...", type: "Sensor" },
    2: { title: "Nutq ...", type: "Nutq" },
    3: { title: "Motori...", type: "Motorika" },
    4: { title: "Senso...", type: "Sensor" },
    5: { title: "Motori...", type: "Motorika" },
  },
  1: { // 10:00
    0: { title: "Motori...", type: "Motorika" },
    1: { title: "Nutq ...", type: "Nutq" },
    2: { title: "Senso...", type: "Sensor" },
    4: { title: "Individ...", type: "Individual" },
  },
  2: { // 11:00
    0: { title: "Individ...", type: "Individual" },
    1: { title: "Kenga...", type: "Motorika" }, // style exception in design (green color)
    3: { title: "Nutq ...", type: "Nutq" },
    4: { title: "Nutq ...", type: "Nutq" },
    5: { title: "Individ...", type: "Individual" },
  },
};

const activityColors = {
  Nutq: { bg: "bg-[#F4F8FE]", border: "border-[#D1E4FF]", text: "text-[#4D89FF]" },
  Motorika: { bg: "bg-[#F3FCF9]", border: "border-[#CDEBE0]", text: "text-[#3DB87E]" },
  Sensor: { bg: "bg-[#FFF9F2]", border: "border-[#FBE4CA]", text: "text-[#FF9500]" },
  Individual: { bg: "bg-[#F8F9FB]", border: "border-[#E2E8F0]", text: "text-[#2D3142]" },
};

export function DailyCalendarView() {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm mt-6">
      <h3 className="text-[17px] font-bold text-[#2D3142] mb-8">Kunlik jadval</h3>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[850px]">
          {/* Header Row */}
          <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] gap-[10px] mb-[14px]">
            <div className="text-[12.5px] font-medium text-[#9EB1D4] pt-1.5 text-center">Vaqt</div>
            {days.map((day) => (
              <div key={day} className="text-[13px] font-medium text-[#2D3142] text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="space-y-[10px]">
            {times.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] gap-[10px]">
                {/* Time Column */}
                <div className="text-[12.5px] font-medium text-[#9EB1D4] flex items-center justify-center pt-1">
                  {time}
                </div>

                {/* Day Columns */}
                {days.map((_, dayIndex) => {
                  const block = scheduleData[timeIndex]?.[dayIndex];

                  if (block) {
                    const colors = activityColors[block.type];
                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "h-[44px] rounded-[10px] flex items-center justify-between px-3.5 border transition-all hover:brightness-95 cursor-pointer",
                          colors.bg,
                          colors.border
                        )}
                      >
                        <span className={cn("text-[13px] font-medium tracking-tight", colors.text)}>
                          {block.title}
                        </span>
                        {block.isCompleted && (
                          <div className="w-[18px] h-[18px] bg-[#3DB87E] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                            <CheckCircle2 className="w-[12px] h-[12px] text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Empty Slot
                  return (
                    <div
                      key={dayIndex}
                      className="h-[44px] rounded-[10px] border border-dashed border-gray-200"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center gap-5 mt-10">
        {[
          { color: "bg-[#D1E4FF]", label: "Nutq" },
          { color: "bg-[#CDEBE0]", label: "Motorika" },
          { color: "bg-[#FBE4CA]", label: "Sensor" },
          { color: "bg-[#E2E8F0]", label: "Individual" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={cn("w-[10px] h-[10px] rounded-full", item.color)} />
            <span className="text-[12.5px] font-medium text-[#9EB1D4]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
