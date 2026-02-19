import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Kamola",
    date: "1 oy oldin",
    text: "\"O'g'limda nutq rivojlanishida kechikish bor edi. 3 oylik muntazam mashg'ulotlardan so'ng ijobiy o'zgarishlarni sezishni boshladik. Neuroland platformasiga o'tganimizdan beri esa haftalik progressni grafikda ko'rib borayapmiz.\"",
    rating: 5,
  },
  {
    id: 2,
    name: "Aziza",
    date: "2 hafta oldin",
    text: "\"Qizim maktabga tayyorgarlikda biroz qiynalayotgandi. Bu yerdagi psixologlar yordami bilan o'ziga bo'lgan ishonchi ortdi.\"",
    rating: 5,
  },
   {
    id: 3,
    name: "Malika",
    date: "3 hafta oldin",
    text: "\"Juda qulay platforma. Har kuni qanday mashq bajarish kerakligi tushunarli. Natijalarni shifokorimiz ham kuzatib turadi.\"",
    rating: 5,
  },
  {
    id: 4,
    name: "Sanjar",
    date: "1 oy oldin",
    text: "\"Tahlil natijalari juda aniq. Oldinlari faqat taxmin qilardik, endi raqamlar bilan ko'ryapmiz. Rahmat!\"",
    rating: 4,
  },
];

export const ReviewsSection = () => {
    // Duplicated for marquee effect if needed, but the design shows static cards or a simple slider. 
    // Given the design image shows 2 rows of cards and a photo on one side, let's stick to a grid layout first or a simple marquee if requested.
    // The image shows 2 columns of text cards and a central image. Let's replicate that layout.
    
  return (
    <section className="w-full py-20 bg-slate-50 relative overflow-hidden" id="reviews">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Mijozlarimiz <span className="text-[#1F61F9]">fikrlari</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Minglab ota-onalar ishonchi — bizning eng katta yutug'imiz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column Reviews */}
            <div className="lg:col-span-4 space-y-6">
                {reviews.slice(0, 2).map((review) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                    >
                        <p className="text-slate-600 italic mb-6 leading-relaxed">
                            {review.text}
                        </p>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900">{review.name}</h4>
                                <p className="text-sm text-slate-400">{review.date}</p>
                            </div>
                            <div className="flex gap-0.5 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Center Image */}
            <div className="lg:col-span-4 h-full min-h-[400px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-full rounded-[40px] overflow-hidden relative"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000" 
                        alt="Happy Family" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-8 left-8 text-white">
                        <p className="font-bold text-2xl">Baxtli oilalar</p>
                        <p className="text-white/80">Bizning asosiy maqsadimiz</p>
                    </div>
                </motion.div>
            </div>

            {/* Right Column Reviews */}
            <div className="lg:col-span-4 space-y-6">
                {reviews.slice(2, 4).map((review) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                    >
                        <p className="text-slate-600 italic mb-6 leading-relaxed">
                            {review.text}
                        </p>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-slate-900">{review.name}</h4>
                                <p className="text-sm text-slate-400">{review.date}</p>
                            </div>
                            <div className="flex gap-0.5 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};
