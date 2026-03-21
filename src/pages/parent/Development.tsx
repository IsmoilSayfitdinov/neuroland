import { Loader2 } from "lucide-react";
import RadarChart from "@/components/parent/Development/RadarChart";
import DetailedResults from "@/components/parent/Development/DetailedResults";
import { useParentAnalytics } from "@/hooks/parent/useParentAnalytics";

export default function DevelopmentPage() {
  const { useParentProgress } = useParentAnalytics();
  const { data: progress, isLoading } = useParentProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto pb-10">
      <h1 className="text-[28px] font-bold text-[#1E293B] mb-6">Rivojlanish</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <RadarChart apiData={progress} />
        <DetailedResults apiData={progress} />
      </div>
    </div>
  );
}
