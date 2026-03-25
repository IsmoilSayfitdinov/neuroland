import { useState } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Info,
  Heart,
  Users,
  Image,
  Star,
  MessageSquare,
  HelpCircle,
  Phone,
  Mail,
  Layers,
} from "lucide-react";
import { HeroTab } from "./tabs/HeroTab";
import { AboutTab } from "./tabs/AboutTab";
import { PlatformTab } from "./tabs/PlatformTab";
import { ValuesTab } from "./tabs/ValuesTab";
import { TeamTab } from "./tabs/TeamTab";
import { GalleryTab } from "./tabs/GalleryTab";
import { StoriesTab } from "./tabs/StoriesTab";
import { TestimonialsTab } from "./tabs/TestimonialsTab";
import { FaqTab } from "./tabs/FaqTab";
import { ContactInfoTab } from "./tabs/ContactInfoTab";
import { ContactRequestsTab } from "./tabs/ContactRequestsTab";

const tabs = [
  { id: "hero", label: "Hero", icon: Monitor },
  { id: "about", label: "Biz haqimizda", icon: Info },
  { id: "platform", label: "Platforma", icon: Layers },
  { id: "values", label: "Qadriyatlar", icon: Heart },
  { id: "team", label: "Jamoa", icon: Users },
  { id: "gallery", label: "Galereya", icon: Image },
  { id: "stories", label: "Muvaffaqiyatlar", icon: Star },
  { id: "testimonials", label: "Sharhlar", icon: MessageSquare },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "contact-info", label: "Kontakt", icon: Phone },
  { id: "contact-requests", label: "So'rovlar", icon: Mail },
] as const;

type TabId = (typeof tabs)[number]["id"];

const landingInfo = (
  <>
    <p>Bu bo'limda saytning landing sahifasi kontentini boshqarish mumkin. Barcha o'zgarishlar saytda darhol aks etadi.</p>
    <p><strong>Bo'limlar:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li><strong>Hero</strong> — bosh sahifadagi asosiy banner</li>
      <li><strong>Biz haqimizda</strong> — markaz haqida ma'lumot</li>
      <li><strong>Jamoa</strong> — xodimlar ro'yxati</li>
      <li><strong>Galereya</strong> — rasmlar va video</li>
      <li><strong>Sharhlar</strong> — ota-onalar fikrlari</li>
      <li><strong>FAQ</strong> — ko'p beriladigan savollar</li>
      <li><strong>Kontakt</strong> — aloqa ma'lumotlari va so'rovlar</li>
    </ul>
  </>
);

export default function LandingAdmin() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  return (
    <div className="space-y-6">
      <PageHeader title="Landing sahifa" infoTitle="Landing sahifa boshqaruvi" infoContent={landingInfo} />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-medium whitespace-nowrap transition-all",
              activeTab === tab.id
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-[#F8F9FB] text-[#6B7A99] hover:bg-[#EEF4FF] hover:text-[#2563EB]"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6">
        {activeTab === "hero" && <HeroTab />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "platform" && <PlatformTab />}
        {activeTab === "values" && <ValuesTab />}
        {activeTab === "team" && <TeamTab />}
        {activeTab === "gallery" && <GalleryTab />}
        {activeTab === "stories" && <StoriesTab />}
        {activeTab === "testimonials" && <TestimonialsTab />}
        {activeTab === "faq" && <FaqTab />}
        {activeTab === "contact-info" && <ContactInfoTab />}
        {activeTab === "contact-requests" && <ContactRequestsTab />}
      </div>
    </div>
  );
}
