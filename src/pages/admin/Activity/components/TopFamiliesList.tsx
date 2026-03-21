import { Users } from "lucide-react";

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

      {families.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8F9FB] flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-[#C8D5E8]" />
          </div>
          <p className="text-[15px] font-bold text-[#2D3142] mb-1">
            Hozircha ma'lumot yo'q
          </p>
          <p className="text-[13px] text-[#9EB1D4] max-w-[240px]">
            Oilalar faollik ko'rsatgandan so'ng bu yerda reyting paydo bo'ladi
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {families.map((family) => (
            <div key={family.rank} className="flex items-center justify-between p-4 bg-[#F8F9FB] rounded-[16px]">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#EEF4FF] text-[#4D89FF] flex items-center justify-center font-bold text-[14px]">
                  {family.rank}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#2D3142]">{family.name}</h4>
                  {family.tasks && (
                    <p className="text-[13px] text-[#6B7A99] font-medium mt-0.5">Vazifalar: {family.tasks}</p>
                  )}
                </div>
              </div>
              <div className="text-[18px] font-bold text-[#2563EB]">
                {family.progress}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
