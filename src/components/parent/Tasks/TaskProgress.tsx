interface TaskProgressProps {
  completedCount: number;
  totalCount: number;
}

export default function TaskProgress({ completedCount, totalCount }: TaskProgressProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-[#1E293B] text-[16px]">Bugungi vazifalar</h2>
          <p className="text-[13px] text-[#768093] mt-1">
            {completedCount}/{totalCount} bajarildi
          </p>
        </div>
        <div className="bg-[#22C55E] text-white text-[12px] font-bold px-3 py-1 rounded-full">
          {Math.round(progress)}%
        </div>
      </div>
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
