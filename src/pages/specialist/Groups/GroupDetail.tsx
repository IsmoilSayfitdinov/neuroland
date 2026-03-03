import GroupStudentCard from "@/components/specialist/Groups/GroupStudentCard";
import WeeklySchedule from "@/components/specialist/Groups/WeeklySchedule";
import GroupAnalyticsSidebar from "@/components/specialist/Groups/GroupAnalyticsSidebar";

const students = [
  { id: "1", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "2", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "3", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "4", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "5", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "6", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "7", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "8", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "9", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "10", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "11", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
  { id: "12", name: "Aziz Karimov", progress: 83, status: "Barqaror" as const, isPaid: true },
];

export default function GroupDetail() {
  return (
    <div className="flex flex-col gap-10 pb-20">
      <h1 className="text-3xl font-black text-slate-800">Guruh A</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {students.map((student) => (
              <GroupStudentCard key={student.id} {...student} />
            ))}
          </div>

          <WeeklySchedule />
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4">
          <GroupAnalyticsSidebar />
        </div>
      </div>
    </div>
  );
}
