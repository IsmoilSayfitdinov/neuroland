import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export const ProblemSolutionSection = () => {
  const items = [
    {
      problem: "Qog'oz hujjatlar",
      problemDesc: "Barcha ma'lumotlar qog'ozda, yo'qolish xavfi yuqori.",
      solution: "Raqamli tashxis",
      solutionDesc: "Barcha tashxis natijalari bulutda, xavfsiz saqlangan.",
    },
    {
      problem: "Kuzatuv yo'q",
      problemDesc: "Bolaning rivojlanishini kuzatish imkoni cheklangan.",
      solution: "Dinamik monitoring",
      solutionDesc: "Haftalik va oylik grafiklar orqali o'zgarishlarni real vaqtda ko'rish.",
    },
    {
      problem: "Aloqa uzilishi",
      problemDesc: "Shifokor va ota-onalar o'rtasida axborot almashish qiyin.",
      solution: "Aloqa ko'prigi",
      solutionDesc: "Chat, video qo'ng'iroq va bildirishnomalar orqali doimiy aloqa.",
    },
     {
      problem: "Shaxsiy yondashuv yo'q",
      problemDesc: "Barcha bolalarga bir xil umumiy tavsiyalar beriladi.",
      solution: "AI davolash rejalari",
      solutionDesc: "Sun'iy intellekt har bir bola uchun individual mashqlarni tanlaydi.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white" id="solutions">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Muammo va <span className="text-blue-600">yechim</span>
          </h2>
          <p className="text-slate-500 text-lg">
            An'anaviy usullardan zamonaviy raqamli platformaga o'tish
          </p>
        </div>

        <div className="grid gap-6 max-w-5xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 group"
            >
              {/* Problem Card */}
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-[24px] flex items-start gap-4 hover:bg-red-50 transition-colors duration-300">
                <div className="bg-red-100 text-red-500 p-3 rounded-xl shrink-0">
                  <X size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.problem}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.problemDesc}
                  </p>
                </div>
              </div>

              {/* Solution Card */}
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-[24px] flex items-start gap-4 hover:bg-blue-50 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl shrink-0">
                  <Check size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{item.solution}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
