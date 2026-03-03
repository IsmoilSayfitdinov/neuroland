import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MentalAgeGauge() {
  const percentage = 2; // Mock value as per design
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="shadow-sm border-slate-100 rounded-2xl">
      <CardHeader className="flex flex-row items-center border-b border-slate-50 pb-4">
        <CardTitle className="text-sm font-bold text-slate-800">Aqliy yosh natijasi</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="relative flex flex-col items-center justify-center mb-8">
          <svg className="w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#D1D5DB"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (0.75 * circumference)} // Background dots spacing
              strokeLinecap="round"
              className="opacity-20"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="#EF4444"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Dots on the gauge */}
            {[0, 90, 180, 270].map((angle, i) => (
              <circle
                key={i}
                cx={96 + Math.cos((angle * Math.PI) / 180) * radius}
                cy={96 + Math.sin((angle * Math.PI) / 180) * radius}
                r="4"
                fill="#EF4444"
              />
            ))}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800">{percentage}%</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aqliy yosh</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Yig'ilgan ball</span>
            <span className="font-black text-slate-800">1.5 / 87</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Aqliy yosh</span>
            <span className="font-black text-slate-800">1 oy</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Xronologik yosh</span>
            <span className="font-black text-slate-800">38 oy</span>
          </div>

          <div className="bg-red-50 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-red-400">Farq</span>
            <span className="text-xs font-black text-red-600">- 37 oy</span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
              <span>Xronologik</span>
              <span>Aqliy</span>
            </div>
            <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500" style={{ width: '2%' }} />
              <div className="h-full bg-blue-400" style={{ width: '98%' }} />
            </div>
            <div className="flex justify-between">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
