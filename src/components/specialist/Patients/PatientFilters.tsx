import { cn } from "@/lib/utils";

interface PatientFiltersProps {
  activeTab: 'all' | 'new';
  onTabChange: (tab: 'all' | 'new') => void;
}

export default function PatientFilters({ activeTab, onTabChange }: PatientFiltersProps) {
  return (
    <div className="flex items-center gap-2 bg-white p-1 rounded-xl w-fit border border-slate-100 mb-8">
      <button
        onClick={() => onTabChange('all')}
        className={cn(
          "px-6 py-2 rounded-lg text-sm font-bold transition-all",
          activeTab === 'all' 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        Hammasi
      </button>
      <button
        onClick={() => onTabChange('new')}
        className={cn(
          "px-6 py-2 rounded-lg text-sm font-bold transition-all",
          activeTab === 'new' 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        Yangi
      </button>
    </div>
  );
}
