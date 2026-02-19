import { motion } from "framer-motion";
import { TrendingUp, Award, Calendar, ChevronRight } from "lucide-react";

const successStories = [
  {
    id: 1,
    name: "Aziz",
    age: "4 yosh",
    diagnosis: "Nutq rivojlanishining kechikishi",
    period: "6 oy",
    stats: {
      before: "Faqat 5-10 ta so'z ishlatardi, ko'rsatma bilan muloqot qilardi.",
      after: "50+ so'z, oddiy jumlalar tuzadi, tengdoshlari bilan muloqot qiladi.",
      metrics: [
        { label: "Nutq ko'rsatkichi", value: 78, color: "bg-green-500" },
        { label: "Ijtimoiylashuv", value: 65, color: "bg-green-500" },
        { label: "Mashqlarga ishtirok", value: 85, color: "bg-green-500" },
      ],
    },
  },
  {
    id: 2,
    name: "Dilnoza",
    age: "6 yosh",
    diagnosis: "Autizm spektri buzilishi (yengil daraja)",
    period: "12 oy",
    stats: {
      before: "Ko'z kontakti yo'q, takroriy harakatlar, yangi muhitga moslashish qiyin.",
      after: "Ko'z kontakti barqaror, maktabga tayyorgarlik kursiga qatnashmoqda.",
      metrics: [
        { label: "Ko'z kontakti", value: 72, color: "bg-green-500" },
        { label: "Adaptatsiya", value: 60, color: "bg-yellow-500" },
        { label: "Mustaqillik", value: 70, color: "bg-green-500" },
      ],
    },
  },
  {
    id: 3,
    name: "Jasur",
    age: "3 yosh",
    diagnosis: "Motorik rivojlanish kechikishi",
    period: "4 oy",
    stats: {
      before: "Qalam ushlay olmas, zinapoyadan ko'tarilishda qiyinchilik.",
      after: "Chizish, kesish ko'nikmalari shakllandi, jismoniy faolligi oshdi.",
      metrics: [
        { label: "Yirik motorika", value: 88, color: "bg-green-500" },
        { label: "Mayda motorika", value: 75, color: "bg-green-500" },
        { label: "Koordinatsiya", value: 80, color: "bg-green-500" },
      ],
    },
  },
];

export const SuccessStoriesSection = () => {
  return (
    <section className="w-full py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#EBF4FF] text-[#1F61F9] rounded-full font-medium text-sm">
            Natijalarimiz
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Haqiqiy <span className="text-green-600">muvaffaqiyat</span> tarixlari
          </h2>
          <p className="text-slate-500 text-lg">
            Har bir raqam ortida — bolaning tabassumi, ota-onaning ishonchi va shifokorning mehnati bor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
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
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Oldin</span>
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
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Keyin</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed relative z-10">
                    {story.stats.after}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {story.stats.metrics.map((metric, i) => (
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
