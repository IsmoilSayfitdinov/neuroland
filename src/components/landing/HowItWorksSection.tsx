import { motion } from "framer-motion";
import { ClipboardCheck, Calendar, Activity, LineChart } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      id: "01",
      icon: ClipboardCheck,
      title: "Tashxis",
      description: "Bolaning rivojlanish darajasini aniqlash",
    },
    {
      id: "02",
      icon: Calendar,
      title: "Reja",
      description: "Shaxsiy mashq rejasini tuzish",
    },
    {
      id: "03",
      icon: Activity,
      title: "Mashqlar",
      description: "Kundalik mashqlarni bajarish va kuzatish",
    },
    {
      id: "04",
      icon: LineChart,
      title: "Tahlil",
      description: "Natijalarni ko'rish va yangilash",
    },
  ];

  return (
    <section className="w-full py-20 bg-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Qanday <span className="text-[#1F61F9]">ishlaydi?</span>
          </h2>
          <p className="text-slate-500 text-lg">
            4 oddiy qadam orqali bolangiz rivojlanishini boshqaring
          </p>
        </div>

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
