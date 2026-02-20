import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const FaqItem = ({ faq, isOpen, toggle, index }: { faq: any, isOpen: boolean, toggle: () => void, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className={`border-b border-slate-100 last:border-0 py-6 cursor-pointer group hover:bg-slate-50/50 px-4 rounded-2xl transition-colors ${isOpen ? 'bg-slate-50' : ''}`}
      onClick={toggle}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-[#1F61F9]' : 'text-slate-900 group-hover:text-[#1F61F9]'}`}>
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-[#1F61F9] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-[#1F61F9]'}`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
              opacity: { duration: 0.25, delay: 0.1 }
            }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="pt-4 text-slate-500 leading-relaxed pr-8"
            >
              {faq.answer}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FaqSection = () => {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<number | null>(1); // Default open first item

  const faqs = (t("faq.items", { returnObjects: true }) as any[]).map((item: any, idx: number) => ({
    id: idx + 1,
    question: item.question,
    answer: item.answer,
  }));

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full lg:px-[32px] mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] bg-white" id="faq">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl w-full font-bold text-slate-900 leading-tight"
              >
                {t("faq.title")}
                <span className="ml-2 text-[#1F61F9]">{t("faq.titleHighlight")}</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-slate-500 text-lg max-w-lg"
              >
                {t("faq.description")}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#F8FAFC] rounded-[32px] p-6 md:p-8 border border-slate-100"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1F61F9] shadow-sm shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">{t("faq.securityTitle")}</h4>
                        <p className="text-sm text-slate-500 mb-4">
                            {t("faq.securityText")}
                        </p>
                        <button className="text-[#1F61F9] font-bold text-sm hover:underline flex items-center gap-2 group">
                            {t("faq.contactBtn")}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>
          </motion.div>

          {/* Right Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-white lg:pl-12"
          >
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                toggle={() => toggle(faq.id)}
                index={index}
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
