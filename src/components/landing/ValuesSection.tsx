import { motion } from "framer-motion";
import { Heart, Target, Eye, Lightbulb } from "lucide-react";
import Image from "@/assets/images/image 3.png"
export const ValuesSection = () => {
  return (
    <section className="w-full py-20 bg-white mt-0 xl:mt-[112px]">
      <div className="max-w-[1920px] mx-auto ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="space-y-6 flex flex-col justify-center">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#F8FAFC] p-8 rounded-[32px] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mehr bilan yondashish</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Har bir bolaning rivojlanishi biz uchun nafaqat ish, balki yuksak mas'uliyatdir. Biz individual ehtiyojlarni chuqur o'rganib chiqamiz.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#F8FAFC] p-8 rounded-[32px] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aniqlik</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Zamonaviy neyrologik metodikalar va ma'lumot tahlili orqali bolaning rivojlanishidagi eng kichik o'zgarishni aniqlaymiz.
              </p>
            </motion.div>
          </div>

          {/* Center Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full flex items-center justify-center px-4"
          >
            <div className="relative w-full aspect-[550/444] lg:aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={Image} 
                alt="Neuroland AI Analysis" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent mix-blend-multiply" />
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col justify-center">
            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#F8FAFC] p-8 rounded-[32px] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Shaffoflik</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Neuroland platformasi orqali ota-onalar jarayonning bosqichini real vaqt rejimida kuzatib boradilar.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#F8FAFC] p-8 rounded-[32px] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovatsiya</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Biz raqamli texnologiyalarni tatbiq etamiz. Sun'iy intellektga asoslangan tahlillar orqali neyro-rivojlanish jarayonini tezlashtiramiz.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
