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
} from "lucide-react";
import { HeroTab } from "./tabs/HeroTab";
import { AboutTab } from "./tabs/AboutTab";
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

export default function LandingAdmin() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  return (
    <div className="space-y-6">
      <PageHeader title="Landing sahifa" />

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
