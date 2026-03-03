import { useState } from "react";
import { cn } from "@/lib/utils";

const categories = [
  "Nutq", 
  "Motorika", 
  "Sensor", 
  "Kognitiv", 
  "Ijtimoiy", 
  "Emotsional", 
  "O-o'ziga xizmat", 
  "Diqqat"
];

export default function DiagnosticsHeader() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6 mb-8">
      <h1 className="text-2xl font-bold text-slate-800">Diagnostika</h1>
      
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
        {categories.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
              activeTab === idx 
                ? "bg-white text-slate-800 shadow-sm border-slate-100" 
                : "bg-slate-100/50 text-slate-400 border-transparent hover:bg-slate-100"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
