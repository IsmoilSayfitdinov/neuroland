import { useState } from "react";
import KnowledgeCategoryTabs from "@/components/specialist/Knowledge/KnowledgeCategoryTabs";
import KnowledgeVideoCard from "@/components/specialist/Knowledge/KnowledgeVideoCard";

const mockVideos = [
  { id: 1, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
  { id: 2, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
  { id: 3, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
  { id: 4, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
  { id: 5, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
  { id: 6, title: "Katta motorika asoslari", category: "Motor ko'nikmalar", ageRange: "0-1 yosh", duration: "5:30", equipment: "To'p, Mat", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop", isUnlocked: false },
];

export default function KnowledgeCenter() {
  const [activeCategory, setActiveCategory] = useState("Kognitiv");

  return (
    <div className="flex flex-col gap-8 pb-12">
      <h1 className="text-2xl font-black text-slate-800">Bilim markazi</h1>

      <div className="bg-white rounded-[40px] p-10 border border-slate-50 space-y-10">
        <KnowledgeCategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockVideos.map((video) => (
            <KnowledgeVideoCard key={video.id} {...video} />
          ))}
        </div>
      </div>
    </div>
  );
}
