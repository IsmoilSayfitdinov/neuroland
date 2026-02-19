import { motion } from "framer-motion";
import { MapPin, ExternalLink, Play } from "lucide-react";
import img3 from "@/assets/images/image 3.png";

const galleryItems = [
  {
    id: 1,
    title: "Amaliy xonalar",
    desc: "Maxsus jihozlangan xonalar",
    image: img3,
  },
  {
    id: 2,
    title: "Tashxis xonasi",
    desc: "Eng so'nggi diagnostika uskunalari",
    image: img3,
  },
  {
    id: 3,
    title: "Sensor zal",
    desc: "Turli sezgi organlarini rivojlantirish",
    image: img3,
  },
  {
    id: 4,
    title: "Logopedik xona",
    desc: "Nutq kamchiliklarini tuzatish",
    image: img3,
  },
  {
    id: 5,
    title: "O'yin maydoni",
    desc: "Foydali va qiziqarli o'yinlar",
    image: img3,
  },
  {
    id: 6,
    title: "Kutish zali",
    desc: "Ota-onalar uchun qulay sharoit",
    image: img3,
  },
];

export const GallerySection = () => {
  return (
    <section className="w-full py-20 bg-white" id="gallery">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#EBF4FF] text-[#1F61F9] rounded-full font-medium text-sm">
            Kichik galereya
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Bizning <span className="text-[#1F61F9]">muhit</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Zamonaviy uskunalar va bolalar uchun qulay muhit — bizning markazimizning asosiy standarti
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[4/3] rounded-[32px] overflow-hidden cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </div>

               {/* Play Icon Overlay (Optional visual touch) */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <Play fill="white" size={24} className="ml-1"/>
                    </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Location Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-[24px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-4xl mx-auto"
        >
            <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 bg-blue-50 text-[#1F61F9] rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900">Toshkent shahri, Chilonzor tumani, Bunyodkor ko'chasi 4</h4>
                   <p className="text-sm text-slate-500">Mo'ljal: Mirzo Ulug'bek metro bekati</p>
                </div>
            </div>

            <a 
                href="https://yandex.com/maps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#1F61F9] font-medium hover:underline shrink-0"
            >
                <span>Xaritada ko'rsatish</span>
                <ExternalLink size={18} />
            </a>
        </motion.div>
      </div>
    </section>
  );
};
