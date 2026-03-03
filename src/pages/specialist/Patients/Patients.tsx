import { useState } from "react";
import PatientCard from "@/components/specialist/Patients/PatientCard";
import PatientFilters from "@/components/specialist/Patients/PatientFilters";

const allPatients = [
  { id: 1, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 2, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 3, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 4, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 5, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 6, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 7, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
  { id: 8, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 78, lastTest: "2 days ago", nextTest: "Feb 21, 2026", isNew: false },
];

const newPatients = [
  { id: 9, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 10, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 11, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 12, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 13, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 14, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 15, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
  { id: 16, name: "Ali Yunusov", age: 4, diagnostic: "Nutq kechikishi", progress: 0, lastTest: "-", nextTest: "-", isNew: true },
];

export default function Patients() {
  const [activeTab, setActiveTab] = useState<'all' | 'new'>('all');

  const patients = activeTab === 'all' ? allPatients : newPatients;

  return (
    <div className="flex flex-col gap-2 pb-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Bemorlarim</h1>
      
      <PatientFilters activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {patients.map(patient => (
          <PatientCard key={patient.id} {...patient} />
        ))}
      </div>
    </div>
  );
}
