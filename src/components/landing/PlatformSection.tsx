import { motion } from "framer-motion";
import { Stethoscope, Users, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import PhonePng from "@/assets/images/Free Transparent iPhone Air Mockup (Mockuuups Studio).png";
import type { PlatformSection as PlatformSectionType } from "@/types/landing.types";

interface PlatformSectionProps {
  platform?: PlatformSectionType;
}

export const PlatformSection = ({ platform }: PlatformSectionProps) => {
  const { t } = useTranslation();

  if (!platform) return null;

  return (
    <section className="w-full mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] bg-white" id="platform">
      <div className=" mx-auto px-4 md:px-8">
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
            {platform.description}
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Mobile App Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 bg-[#F8FAFC] rounded-[40px] p-8 md:p-12 flex items-end justify-center relative overflow-hidden h-full min-h-[500px]"
          >
            <img src={platform.image_url || PhonePng} alt="Mobile App Mockup" className="w-auto max-h-[450px] bottom-0 absolute z-50 object-contain " />
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-0" />
          </motion.div>

          {/* Center: Doctor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 bg-white border border-slate-100 rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-shadow duration-300 h-full"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Stethoscope size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("platform.doctorTitle")}</h3>
            <p className="text-slate-500 mb-8">{t("platform.doctorDesc")}</p>

            <ul className="space-y-4">
              {(t("platform.doctorFeatures", { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="text-blue-600 shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Parent Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1 bg-white border border-slate-100 rounded-[40px] p-8 md:p-10 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-shadow duration-300 h-full"
          >
            <div className="w-14 h-14 bg-[#EBF4FF] rounded-2xl flex items-center justify-center text-[#1F61F9] mb-6">
              <Users size={28} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("platform.parentTitle")}</h3>
            <p className="text-slate-500 mb-8">{t("platform.parentDesc")}</p>

            <ul className="space-y-4">
              {(t("platform.parentFeatures", { returnObjects: true }) as string[]).map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 className="text-[#1F61F9] shrink-0" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
