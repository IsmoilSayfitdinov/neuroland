import { useState } from "react";
import PatientDetailHeader from "@/components/specialist/Patients/Detail/PatientDetailHeader";
import ShortAnalysis from "@/components/specialist/Patients/Detail/ShortAnalysis";
import BasicInfoTab from "@/components/specialist/Patients/Detail/BasicInfoTab";
import DevelopmentHistoryTab from "@/components/specialist/Patients/Detail/DevelopmentHistoryTab";
import { cn } from "@/lib/utils";

export default function PatientDetail() {
  const [activeTab, setActiveTab] = useState<'basic' | 'history'>('basic');

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-2xl font-bold text-slate-800">Bemorlarim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <PatientDetailHeader 
            name="Dankovskiy Danil"
            alias="Danya"
            birthDate="12.03.2020"
            age="4 yil 11 oy"
          />

          <div className="flex items-center gap-2 bg-white/50 p-1 rounded-2xl w-fit border border-slate-100/50">
            <button
              onClick={() => setActiveTab('basic')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === 'basic' 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              Asosiy ma'lumotlar
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-8 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === 'history' 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              Rivojlanish tarixi
            </button>
          </div>

          {activeTab === 'basic' ? <BasicInfoTab /> : <DevelopmentHistoryTab />}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <ShortAnalysis />
        </div>
      </div>
    </div>
  );
}
