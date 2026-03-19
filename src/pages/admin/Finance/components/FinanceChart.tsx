import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface FinanceChartProps {
  data: any[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[15px] font-medium text-[#2D3142] mb-8">Tarif bo'yicha daromad (mln UZS)</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={60}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9EB1D4', fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9EB1D4', fontSize: 13 }} dx={-10} />
            <Tooltip 
              cursor={{ fill: '#f8f9fa' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Bar dataKey="yengil" stackId="a" fill="#4D89FF" />
            <Bar dataKey="standart" stackId="a" fill="#3DB87E" />
            <Bar dataKey="individual" stackId="a" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#4D89FF]" />
          <span className="text-[13px] font-bold text-[#4D89FF]">Yengil</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3DB87E]" />
          <span className="text-[13px] font-bold text-[#3DB87E]">Standart</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#F59E0B]" />
          <span className="text-[13px] font-bold text-[#F59E0B]">Individual</span>
        </div>
      </div>
    </div>
  );
}
