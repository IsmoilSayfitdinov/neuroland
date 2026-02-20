import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import Image from "@/assets/images/image 2.png"
export const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] bg-white" id="about">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="xl:flex gap-[49px] items-center">
          {/* Left Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full xl:max-w-[541px]"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="aspect-4/3 xl:aspect-541/436 relative w-full">
                 <img 
                   src={Image} 
                   alt="Medical Team"
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-blue-900/10"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8 xl:mt-0 mt-10"
          >
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium text-sm">
              {t("about.badge")}
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                {t("about.title")}
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl">
                {t("about.description")}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {/* Mission Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 rounded-[24px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t("about.missionTitle")}</h3>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                  {t("about.missionText")}
                </p>
              </motion.div>

              {/* Vision Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 rounded-[24px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 transition-all"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t("about.goalTitle")}</h3>
                <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                   {t("about.goalText")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
