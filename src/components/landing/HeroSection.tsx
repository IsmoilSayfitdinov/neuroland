import { motion } from "framer-motion";
import ImageBannerPeople from "@/assets/images/bannerImagePeoples.png"
import { Navbar } from "./Navbar";
export const HeroSection = () => {
  return (
    <section 
      className="relative mx-auto  lg:rounded-[30px] px-4 md:px-[32px] pt-4 md:pt-[32px] overflow-hidden"
      style={{
        background: "linear-gradient(108.32deg, rgba(31, 97, 249, 0.1) 0%, rgba(89, 176, 3, 0.1) 111.59%)"
      }}
    >
      <Navbar/>
      <div className="mt-8 md:mt-[80px] px-[32px]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-green-100/30 rounded-full blur-[100px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F61F90D] text-[#1F61F9] rounded-full text-xs font-bold border border-[#1F61F933]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F61F9] animate-pulse" />
              #1 Neyro-rivojlanish platformasi
            </div>

            {/* Headline */}
            <h1 className="text-[32px] md:text-[60px] font-extrabold leading-[1.2] md:leading-[1.1] tracking-tight text-slate-900">
              Bolalar neyro-
              <div className="block">rivojlanishini</div>
              <span className="text-[#1F61F9]">raqamli nazorat</span>{" "}
              qilish davri
            </h1>

            {/* Description */}
            <p className="text-base md:text-[18px] text-[#65758B] max-w-lg leading-relaxed font-medium">
              Neuroland — tashxisdan tortib, natijagacha bo'lgan jarayonni
              avtomatlashtiruvchi klinika va ota-onalar uchun yagona platforma.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-[#1F61F9] hover:bg-[#1F61F9] text-white px-6 md:px-8 py-3 md:py-4 rounded-[24px] font-semibold text-base md:text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-1 cursor-pointer w-full md:w-auto">
                Konsultatsiya olish
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12 pb-9 overflow-x-auto md:overflow-visible no-scrollbar" >
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">500+</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Faol foydalanuvchilar</p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">50+</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Klinikalar</p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">98%</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Mijozlar ishonchi</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:flex hidden items-center justify-center lg:justify-end w-full"
          >
            <div className="relative min-h-[300px] md:min-h-[594px] w-full lg:min-w-[630px] aspect-square md:aspect-[4/3]">
              <div className="absolute inset-0 bg-transparent rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-end justify-center">
                 <img 
                   src={ImageBannerPeople} 
                   alt="3D Doctor Illustration" 
                   className="w-full h-full object-contain"
                 />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
