import { motion } from "framer-motion";
import { Stethoscope, Users, CheckCircle2 } from "lucide-react";
import type { PlatformSection as PlatformSectionType } from "@/types/landing.types";
import ImagePhomnne from "@/assets/images/Free Transparent iPhone Air Mockup (Mockuuups Studio).png";
interface PlatformSectionProps {
  platform?: PlatformSectionType;
}

export const PlatformSection = ({ platform }: PlatformSectionProps) => {
  if (!platform) return null;

  const doctorFeatures = Array.isArray(platform.doctor_features)
    ? platform.doctor_features
    : typeof platform.doctor_features === "object" && platform.doctor_features
      ? Object.values(platform.doctor_features)
      : [];

  const parentFeatures = Array.isArray(platform.parent_features)
    ? platform.parent_features
    : typeof platform.parent_features === "object" && platform.parent_features
      ? Object.values(platform.parent_features)
      : [];

  const roles = [
    {
      icon: Stethoscope,
      title: platform.doctor_title || "Shifokor",
      subtitle: platform.doctor_subtitle || "Tashxis va davolash jarayonini boshqarish",
      features: doctorFeatures,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: platform.parent_title || "Ota-ona",
      subtitle: platform.parent_subtitle || "Bolangiz rivojlanishini kuzating",
      features: parentFeatures,
      iconBg: "bg-blue-50",
      iconColor: "text-[#1F61F9]",
    },
  ];

  return (
    <section
      className="w-full py-[48px] md:py-[112px]"
      id="platform"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            {platform.title}
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            {platform.subtitle}
          </p>
        </motion.div>

        {/* Content: Phone + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-[479px] h-[371px] flex items-end justify-center bg-[#F6F8FD] rounded-[36px] overflow-hidden p-3">
                 <img
                  src={ImagePhomnne}
                  alt="Platform"
                  className="w-[328px] rounded-[28px] mb-[-28px]"
                />
            </div>
          </motion.div>

          {/* Role Cards */}
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${role.iconBg} rounded-2xl flex items-center justify-center ${role.iconColor} mb-6`}
              >
                <role.icon size={24} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {role.title}
              </h3>
              <p className="text-slate-400 text-[14px] mb-6">
                {role.subtitle}
              </p>

              <ul className="space-y-3.5">
                {doctorFeatures.length > 0 || parentFeatures.length > 0
                  ? role.features.map((item: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-[14px] text-slate-600"
                      >
                        <CheckCircle2
                          className="text-blue-500 shrink-0"
                          size={18}
                        />
                        <span>{item}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
