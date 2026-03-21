import { motion } from "framer-motion";
import { Heart, Target, Eye, Lightbulb } from "lucide-react";
import Image from "@/assets/images/image 3.png"
import type { ValueCard } from "@/types/landing.types";

const icons = [Heart, Target, Eye, Lightbulb];

interface ValuesSectionProps {
  values?: ValueCard[];
}

export const ValuesSection = ({ values }: ValuesSectionProps) => {
  if (!values || values.length === 0) return null;

  const leftValues = values.slice(0, 2);
  const rightValues = values.slice(2, 4);

  return (
    <section className="w-full mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] bg-white" id="values">
      <div className="mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-center">

          <div className="space-y-6 flex flex-col justify-center order-2 lg:order-1">
            {leftValues.map((val, i) => {
              const Icon = icons[i] || Heart;
              return (
                <motion.div
                  key={val.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                  whileHover={{ y: -5 }}
                  className="bg-[#F6F8FD] border border-[#FFFFFF4D] p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                  <p className="text-[#65758B] text-[14px] font-normal leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Center Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center order-1 lg:order-2"
          >
            <div className="relative w-full aspect-square rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src={Image}
                alt="Neuroland AI Analysis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent mix-blend-multiply" />
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col justify-center order-3">
            {rightValues.map((val, i) => {
              const Icon = icons[i + 2] || Lightbulb;
              return (
                <motion.div
                  key={val.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (i + 3) }}
                  whileHover={{ y: -5 }}
                  className="bg-[#F6F8FD] border border-[#FFFFFF4D] p-6 md:p-8 rounded-[32px] shadow-xl shadow-slate-200/50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#1F61F9] mb-6">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
