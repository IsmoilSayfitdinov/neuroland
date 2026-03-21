import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TariffTrend } from "@/types/analytics.types";

interface FinanceChartProps {
  data: TariffTrend[];
}

const PLAN_COLORS: Record<string, string> = {
  Light: "#4D89FF",
  Standard: "#3DB87E",
  Individual: "#F59E0B",
};

export function FinanceChart({ data }: FinanceChartProps) {
  // Barcha plan nomlarini yig'ib olish
  const planNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach((d) => Object.keys(d.plans).forEach((k) => names.add(k)));
    return Array.from(names);
  }, [data]);

  // Recharts uchun flat data
  const chartData = useMemo(() => {
    return data.map((d) => ({
      name: `${d.month} ${d.year}`,
      ...Object.fromEntries(
        Object.entries(d.plans).map(([k, v]) => [k, v / 1_000_000])
      ),
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[15px] font-medium text-[#2D3142] mb-8">Tarif bo'yicha daromad (mln UZS)</h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            barSize={60}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9EB1D4", fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9EB1D4", fontSize: 13 }} dx={-10} />
            <Tooltip
              cursor={{ fill: "#f8f9fa" }}
              contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              formatter={(value: number) => [`${value.toFixed(1)}M`, ""]}
            />
            {planNames.map((name, i) => {
              const defaultColors = ["#4D89FF", "#3DB87E", "#F59E0B", "#EF4444", "#8B5CF6"];
              const color = PLAN_COLORS[name] || defaultColors[i % defaultColors.length];
              return (
                <Bar key={name} dataKey={name} stackId="a" fill={color} />
              );
            })}
            <Legend
              wrapperStyle={{ paddingTop: 16 }}
              formatter={(value: string) => (
                <span className="text-[13px] font-bold" style={{ color: PLAN_COLORS[value] || "#6B7A99" }}>{value}</span>
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
