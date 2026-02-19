import { motion } from "framer-motion";
import { Stethoscope, Users, CheckCircle2 } from "lucide-react";

export const PlatformSection = () => {
  return (
    <section className="w-full py-20 bg-white" id="platform">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Bizning platformamiz haqida
          </h2>
          <p className="text-slate-500 text-lg">
            Platformamiz har bir rol uchun moslashtirilgan interfeysga ega
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Mobile App Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1 bg-[#F8FAFC] rounded-[40px] p-8 md:p-12 flex items-center justify-center relative overflow-hidden h-full min-h-[500px]"
          >
            <div className="relative w-[280px] md:w-[320px] rounded-[48px] border-[8px] border-slate-900 bg-white shadow-2xl overflow-hidden z-10">
              {/* Fake Status Bar */}
              <div className="h-6 w-full bg-white flex justify-between items-center px-6 mt-2">
                <span className="text-xs font-bold text-slate-900">9:41</span>
                <div className="flex gap-1.5 items-center">
                    <div className="h-2.5 w-4 bg-slate-900 rounded-sm"></div>
                    <div className="h-2.5 w-3 bg-slate-900 rounded-sm"></div>
                </div>
              </div>

               {/* Mockup Content */}
               <div className="px-4 pt-4 pb-8 space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <span className="text-xs">←</span>
                   </div>
                   <div>
                     <h4 className="font-bold text-slate-900">Avtomatik tahlil</h4>
                     <p className="text-[10px] text-slate-500">Anvar Karimov • 6 yosh</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-3 gap-2">
                   <div className="bg-blue-50 p-3 rounded-2xl text-center space-y-1">
                     <div className="w-6 h-6 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                     <p className="text-[10px] font-medium text-slate-400">Test</p>
                     <p className="text-[10px] font-bold text-slate-900">Yakunlandi</p>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-2xl text-center space-y-1">
                     <div className="w-6 h-6 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">⚡</div>
                     <p className="text-[10px] font-medium text-slate-400">Tahlil</p>
                     <p className="text-[10px] font-bold text-slate-900">Avtomatik</p>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-2xl text-center space-y-1">
                     <div className="w-6 h-6 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">📅</div>
                     <p className="text-[10px] font-medium text-slate-400">Sana</p>
                     <p className="text-[10px] font-bold text-slate-900">15.01.2026</p>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex gap-2 items-start">
                        <div className="w-4 h-4 mt-0.5 rounded-full bg-slate-200 shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Tahlil mashqlar va bo'limlar muhimligi asosida avtomatik yaratildi. Natijalar dinamikasi ijobiy.
                        </p>
                    </div>
                 </div>
                  <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100"></div>

               </div>
            </div>
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
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Shifokor</h3>
            <p className="text-slate-500 mb-8">Tashxis va davolash jarayonini boshqarish</p>

            <ul className="space-y-4">
              {[
                "Raqamli tashxis qo'yish",
                "Mashq rejalarini yaratish",
                "Natijalarni tahlil qilish",
                "Ota-onalarga xabar yuborish"
              ].map((item, i) => (
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
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ota-ona</h3>
            <p className="text-slate-500 mb-8">Bolangiz rivojlanishini kuzating</p>

            <ul className="space-y-4">
              {[
                "Mashqlarni bajarish",
                "Rivojlanish hisobotlari",
                "Shifokor bilan aloqa",
                "Video qo'llanmalar"
              ].map((item, i) => (
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
