import { cn } from "@/lib/utils";

interface KnowledgeCategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function KnowledgeCategoryTabs({
  activeCategory,
  onCategoryChange,
  categories,
}: KnowledgeCategoryTabsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-400 ml-1">Bo'limlar</p>
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat, idx) => {
          const actuallyActive = activeCategory === cat; 

          return (
            <button
              key={idx}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "px-8 py-3.5 rounded-[18px] text-sm font-bold transition-all whitespace-nowrap border-none",
                actuallyActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-[#F8FAFC] text-slate-400 hover:bg-slate-100"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
