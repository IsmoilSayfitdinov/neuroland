import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import Image from "@/assets/images/image 2.png"
export const AboutSection = () => {
  return (
    <section className="w-full py-20 bg-white xl:mt-[112px]" id="about">
      <div className="max-w-[1920px] mx-auto px-4 md:px-0">
        <div className="xl:flex gap-[49px] ">
          {/* Left Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full xl:max-w-[541px]"
          >
            <div className="relative rounded-[2rem] overflow-hidden ">
              {/* Using a placeholder that represents the medical team meeting from the screenshot */}
              <div className="aspect-[541/436] relative w-full">
                 <img 
                   src={Image} 
                   alt="Medical Team"
                   className="w-full h-full object-cover"
                 />
                 {/* Overlay gradient for better text integration if needed, but keeping it clean for now */}
                 <div className="absolute inset-0 bg-blue-900/10"></div>
              </div>
            </div>
          </motion.div>

          {/* Right Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 xl:mt-0 mt-9"
          >
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium text-sm">
              Biz haqimizda
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Neuroland haqida
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Neuroland — bu faqat texnologiya emas, bu bolalar kelajagiga investitsiya. Biz shifokorlar, ota-onalar va texnologiya mutaxassislarining birgalikdagi sa'y-harakati natijasida tug'ilgan platformamiz.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Mission Card */}
              <div className="p-6 rounded-[24px] bg-white border border-slate-100 backdrop-blur-[24px] shadow-[0px_5px_10px_3px_#0000000D]">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Missiyamiz</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Bolalar neyro-rivojlanishini kuzatish va davolash jarayonini raqamlashtirish va har bir oilaga sifatli tibbiy xizmatlarni yetkazish.
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-6 backdrop-blur-[24px] shadow-[0px_5px_10px_3px_#0000000D] rounded-[24px] bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <Eye size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Maqsadimiz</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  2030-yilgacha O'zbekistondagi barcha bolalar neyrologiya klinikalarini yagona raqamli platformaga birlashtirish.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
