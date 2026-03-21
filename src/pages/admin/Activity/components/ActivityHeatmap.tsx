interface ActivityHeatmapProps {
  days: string[];
  times: string[];
  data: number[][]; // 2D array of intensity (days × hours)
}

export function ActivityHeatmap({ days, times, data }: ActivityHeatmapProps) {
  const getColor = (density: number) => {
    if (density >= 4) return "bg-[#3B82F6]";
    if (density >= 3) return "bg-[#60A5FA]";
    if (density >= 2) return "bg-[#93C5FD]";
    if (density >= 1) return "bg-[#BFDBFE]";
    return "bg-[#EFF6FF]";
  };

  // Har 3-soatdan birini label sifatida ko'rsatamiz (6, 9, 12, 15, 18, 21)
  const visibleTimeIndices = times.length > 10
    ? times.map((_, i) => i).filter((i) => i % 3 === 0)
    : times.map((_, i) => i);

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Faollik issiqlik xaritasi</h3>
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[500px]">
          {/* Timeline Header */}
          <div className="flex gap-1 mb-3 pl-[36px]">
            {times.map((t, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[10px] font-bold text-[#9EB1D4]"
              >
                {visibleTimeIndices.includes(i) ? t : ""}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="space-y-1.5">
            {days.map((day, rowIdx) => (
              <div key={rowIdx} className="flex gap-1 items-center">
                <div className="w-[32px] text-[13px] font-bold text-[#6B7A99] shrink-0">
                  {day}
                </div>
                {(data[rowIdx] || []).map((density, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`flex-1 h-8 rounded-[6px] transition-all hover:scale-95 cursor-pointer ${getColor(density)}`}
                    title={`${day} ${times[colIdx] || ""}: ${density}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-8">
            <span className="text-[12px] font-bold text-[#9EB1D4]">Kam</span>
            <div className="flex gap-2">
              <div className={`w-4 h-4 rounded-full ${getColor(0)}`} />
              <div className={`w-4 h-4 rounded-full ${getColor(1)}`} />
              <div className={`w-4 h-4 rounded-full ${getColor(2)}`} />
              <div className={`w-4 h-4 rounded-full ${getColor(3)}`} />
              <div className={`w-4 h-4 rounded-full ${getColor(4)}`} />
            </div>
            <span className="text-[12px] font-bold text-[#9EB1D4]">Ko'p</span>
          </div>
        </div>
      </div>
    </div>
  );
}
