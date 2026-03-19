interface ActivityHeatmapProps {
  days: string[];
  times: string[];
  data: number[][]; // 2D array of intensity
}

export function ActivityHeatmap({ days, times, data }: ActivityHeatmapProps) {
  const getColor = (density: number) => {
    switch(density) {
      case 4: return "bg-[#3B82F6]"; // Blue 500
      case 3: return "bg-[#60A5FA]"; // Blue 400
      case 2: return "bg-[#93C5FD]"; // Blue 300
      case 1: return "bg-[#BFDBFE]"; // Blue 200
      case 0: return "bg-[#EFF6FF]"; // Blue 50
      default: return "bg-[#EFF6FF]";
    }
  };

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-8">Faollik issiqlik xaritasi</h3>
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[500px]">
          {/* Timeline Header */}
          <div className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 mb-3">
            <div /> {/* Empty intersection */}
            {times.map((t, i) => (
              <div key={i} className="text-center text-[11px] font-bold text-[#9EB1D4]">
                {t}
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="space-y-2">
            {days.map((day, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-[30px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center">
                <div className="text-[13px] font-bold text-[#6B7A99]">
                  {day}
                </div>
                {data[rowIdx].map((density, colIdx) => (
                  <div 
                    key={`${rowIdx}-${colIdx}`} 
                    className={`h-11 rounded-[8px] transition-all hover:scale-95 ${getColor(density)}`}
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
