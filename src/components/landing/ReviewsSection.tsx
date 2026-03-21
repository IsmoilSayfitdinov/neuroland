import { motion } from "framer-motion";
import familyImg from "@/assets/images/family_review.png";
import type { Testimonial } from "@/types/landing.types";

interface ReviewsSectionProps {
  testimonials?: Testimonial[];
}

export const ReviewsSection = ({ testimonials }: ReviewsSectionProps) => {
  if (!testimonials || testimonials.length === 0) return null;

  const reviews = testimonials.map((item) => ({
    id: item.id,
    name: item.client_name,
    role: item.client_role,
    text: item.testimonial_text,
    image: item.image_url,
  }));

  return (
    <section className="w-full mt-[48px] md:mt-[112px] py-[48px] md:py-[112px] bg-background" id="reviews">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
            Ota-onalar fikrlari
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="space-y-6">
            {reviews[0] && <ReviewCard review={reviews[0]} index={0} />}
            {reviews[3] && <ReviewCard review={reviews[3]} index={1} />}
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {reviews[1] && <ReviewCard review={reviews[1]} index={2} />}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-[32px] md:rounded-[40px] overflow-hidden aspect-square shadow-xl shadow-slate-200/50"
            >
              <img src={familyImg} alt="Family" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {reviews[2] && <ReviewCard review={reviews[2]} index={3} />}
            {reviews[4] && <ReviewCard review={reviews[4]} index={4} />}
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({ review, index }: { review: { id: number; name: string; role: string; text: string }, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col"
  >
    <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-medium">
      "{review.text}"
    </p>
    <div className="mt-auto">
      <h4 className="font-bold text-lg md:text-xl text-slate-900 leading-tight">{review.name}</h4>
      <p className="text-sm md:text-base text-slate-400 font-medium">{review.role}</p>
    </div>
  </motion.div>
);
