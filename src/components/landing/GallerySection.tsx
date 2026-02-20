import { motion } from "framer-motion";
import { MapPin, ExternalLink, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import img3 from "@/assets/images/image 3.png";

export const GallerySection = () => {
  const { t } = useTranslation();

  const galleryItems = (t("gallery.items", { returnObjects: true }) as any[]).map((item: any, idx: number) => ({
    id: idx + 1,
    title: item.title,
    desc: item.desc,
    image: img3,
  }));
  return (
    <section className="w-full py-[48px] md:py-[112px] mt-[48px] md:mt-[112px] bg-white" id="gallery">
      <div className="max-w-7xl 2xl:max-w-7xl 3xl:max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4"
        >
          <div className="inline-block px-4 py-1.5 bg-[#EBF4FF] text-[#1F61F9] rounded-full font-medium text-sm">
            {t("gallery.badge")}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            {t("gallery.title")}
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            {t("gallery.description")}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-lg md:text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-white/80 text-xs md:text-sm">{item.desc}</p>
              </div>

               {/* Play Icon Overlay (Optional visual touch) */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                        <Play fill="white" size={20} className="ml-1 md:size-[24px]"/>
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
            className="bg-white border border-slate-100 rounded-[20px] md:rounded-[24px] p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow duration-300  mx-auto"
        >
            <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-[#1F61F9] rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 text-sm md:text-base">{t("gallery.address")}</h4>
                   <p className="text-xs md:text-sm text-slate-500">{t("gallery.landmark")}</p>
                </div>
            </div>

            <motion.a 
                href="https://yandex.com/maps" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-[#1F61F9] font-medium hover:underline shrink-0 bg-background md:bg-transparent px-6 py-3 md:p-0 rounded-full w-full md:w-auto justify-center md:justify-start"
            >
                <span>{t("gallery.showOnMap")}</span>
                <ExternalLink size={18} />
            </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
