import RadarChart from "@/components/parent/Development/RadarChart";
import DetailedResults from "@/components/parent/Development/DetailedResults";

export default function DevelopmentPage() {
  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Rivojlanish</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <RadarChart />
        <DetailedResults />
      </div>
    </div>
  );
}
