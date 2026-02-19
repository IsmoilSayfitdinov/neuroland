import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Xizmatdan foydalanish pullikmi?",
    answer: "Platformaning asosiy funksiyalari (bepul tahlil, oddiy mashqlar) bepul. Maxsus shifokor nazorati va kengaytirilgan mashqlar to'plami uchun oyiga 49,000 so'mdan boshlanadigan tariflar mavjud."
  },
  {
    id: 2,
    question: "Qaysi yoshdagilar uchun mo'ljallangan?",
    answer: "Platformamiz 2 yoshdan 12 yoshgacha bo'lgan bolalar rivojlanishini kuzatish va korreksiya qilish uchun moslashtirilgan. Har bir yosh guruhiga alohida yondashuv qo'llaniladi."
  },
  {
    id: 3,
    question: "Natijalar qanchalik aniq?",
    answer: "Bizning metodikalarimiz xalqaro standartlarga (ASQ-3, M-CHAT) asoslangan bo'lib, sun'iy intellekt yordamida qayta ishlanadi. Aniqlik darajasi 92% dan yuqori."
  },
  {
    id: 4,
    question: "Shifokor bilan qanday bog'lanishim mumkin?",
    answer: "Platformadagi 'Mutaxassis bilan chat' bo'limi orqali istalgan vaqtda savollaringizni yo'llashingiz mumkin. Premium tarif foydalanuvchilari uchun haftalik video qo'ng'iroqlar ham mavjud."
  },
];

const FaqItem = ({ faq, isOpen, toggle }: { faq: any, isOpen: boolean, toggle: () => void }) => {
  return (
    <motion.div 
      initial={false}
      className={`border-b border-slate-100 last:border-0 py-6 cursor-pointer group hover:bg-slate-50/50 px-4 rounded-2xl transition-colors ${isOpen ? 'bg-slate-50' : ''}`}
      onClick={toggle}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-[#1F61F9]' : 'text-slate-900 group-hover:text-[#1F61F9]'}`}>
          {faq.question}
        </h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#1F61F9] text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#1F61F9]'}`}>
           {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-slate-500 leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FaqSection = () => {
  const [openId, setOpenId] = useState<number | null>(1); // Default open first item

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full py-20 bg-white" id="faq">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Content */}
          <div className="space-y-8 sticky top-32">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                Ko'p beriladigan <br />
                <span className="text-[#1F61F9]">savollar</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-md">
                Platformamiz haqida eng ko'p so'raladigan savollarga javoblar
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-[32px] p-6 md:p-8 border border-slate-100">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1F61F9] shadow-sm shrink-0">
                        <ArrowRight size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">Yana savollaringiz bormi?</h4>
                        <p className="text-sm text-slate-500 mb-4">
                            Bizning mutaxasislarimiz sizga yordam berishga tayyor.
                            Istalgan vaqtda murojaat qiling.
                        </p>
                        <button className="text-[#1F61F9] font-bold text-sm hover:underline flex items-center gap-2 group">
                            Bog'lanish
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Accordion */}
          <div className="bg-white lg:pl-12">
            {faqs.map((faq) => (
              <FaqItem 
                key={faq.id} 
                faq={faq} 
                isOpen={openId === faq.id} 
                toggle={() => toggle(faq.id)} 
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
