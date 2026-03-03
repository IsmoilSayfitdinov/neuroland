import AIPlanGroupCard from "@/components/specialist/AIPlan/AIPlanGroupCard";

const groups = [
  { id: "1", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "2", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "3", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "4", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "5", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "6", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "7", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
  { id: "8", name: "Guruh A", ageRange: "3-4 yosh", specialist: "Dr. Kamola Rustamova", studentCount: "12/15", avgProgress: 78 },
];

export default function AIPlanList() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-2xl font-bold text-slate-800">AI reja</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => (
          <AIPlanGroupCard key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
}
