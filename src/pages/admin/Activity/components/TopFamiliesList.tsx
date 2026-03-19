interface Family {
  rank: number;
  name: string;
  tasks: string;
  progress: number;
}

interface TopFamiliesListProps {
  families: Family[];
}

export function TopFamiliesList({ families }: TopFamiliesListProps) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-gray-100 shadow-sm">
      <h3 className="text-[18px] font-bold text-[#2D3142] mb-6">Eng faol oilalar</h3>
      <div className="space-y-4">
        {families.map((family) => (
          <div key={family.rank} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-[16px]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#4D89FF] flex items-center justify-center font-bold text-[14px]">
                {family.rank}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#2D3142]">{family.name}</h4>
                <p className="text-[13px] text-[#6B7A99] font-medium mt-0.5">Vazifalar: {family.tasks}</p>
              </div>
            </div>
            <div className="text-[18px] font-bold text-[#2563EB]">
              {family.progress}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
