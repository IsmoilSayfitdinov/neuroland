import { motion } from "framer-motion";
import { ClipboardCheck, Calendar, Activity, LineChart } from "lucide-react";
import { useTranslation } from "react-i18next";

export const HowItWorksSection = () => {
  const { t } = useTranslation();
  const steps = [
    {
      id: "01",
      icon: ClipboardCheck,
      title: t("howItWorks.steps.0.title"),
      description: t("howItWorks.steps.0.description"),
    },
    {
      id: "02",
      icon: Calendar,
      title: t("howItWorks.steps.1.title"),
      description: t("howItWorks.steps.1.description"),
    },
    {
      id: "03",
      icon: Activity,
      title: t("howItWorks.steps.2.title"),
      description: t("howItWorks.steps.2.description"),
    },
    {
      id: "04",
      icon: LineChart,
      title: t("howItWorks.steps.3.title"),
      description: t("howItWorks.steps.3.description"),
    },
  ];

  return (
    <section className="w-full mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] relative overflow-hidden" style={{ background: 'linear-gradient(193.72deg, #FFFFFF 9.81%, #EBF4FF 51.76%, #FFFFFF 93.7%)' }}>
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-50/50 rounded-full blur-[80px] md:blur-[100px] -z-10" />

      <div className="max-w-7xl 2xl:max-w-7xl 3xl:max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-20 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            {t("howItWorks.title")}{" "}<span className="text-[#1F61F9]">{t("howItWorks.titleHighlight")}</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            {t("howItWorks.description")}
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-blue-100 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                    {/* Number Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1F61F9] text-white flex items-center justify-center text-sm font-bold border-4 border-white z-10 shadow-lg">
                        {step.id}
                    </div>
                    {/* Main Icon Circle */}
                    <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center text-[#1F61F9] group-hover:bg-[#1F61F9] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <step.icon size={32} />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
