import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SuccessStoriesSection = () => {
  const { t } = useTranslation();

  const stories = (t("successStories.stories", { returnObjects: true }) as any[]).map((story: any, idx: number) => ({
    id: idx + 1,
    name: story.name,
    age: story.age,
    diagnosis: story.diagnosis,
    period: story.period,
    stats: {
      before: story.before,
      after: story.after,
      metrics: story.metrics.map((m: any) => ({
        label: m.label,
        value: m.value,
        color: "bg-green-500",
      })),
    },
  }));

  return (
    <section className="w-full py-[48px] md:py-[112px] mt-[48px] md:mt-[112px]relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-1.5 bg-[#EBF4FF] text-[#1F61F9] rounded-full font-medium text-sm">
            {t("successStories.badge")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            {t("successStories.title")}
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            {t("successStories.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: any, index: number) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-[32px] p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {story.name}, {story.age}
                  </h3>
                  <p className="text-[#1F61F9] text-sm font-medium mt-1">
                    {story.diagnosis}
                  </p>
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                  <Calendar size={14} />
                  {story.period}
                </div>
              </div>

              {/* Before/After Cards */}
              <div className="space-y-4 mb-8">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">{t("successStories.before")}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {story.stats.before}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-2xl border border-green-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                      <TrendingUp size={64} className="text-green-600"/>
                   </div>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">{t("successStories.after")}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">
                    {story.stats.after}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {story.stats.metrics.map((metric: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <TrendingUp size={12} /> {metric.value}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className={`h-full ${metric.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
