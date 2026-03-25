import { motion } from "framer-motion";
import type { TeamMember } from "@/types/landing.types";

interface TeamSectionProps {
  team?: TeamMember[];
}

const MEDIA_URL = import.meta.env.VITE_API_MEDIA_URL || "";

export const TeamSection = ({ team }: TeamSectionProps) => {
  if (!team || team.length === 0) return null;

  return (
    <section
      id="team"
      className="w-full py-[48px] md:py-[112px] relative overflow-hidden"
      style={{
        background:
          "linear-gradient(193.72deg, #FFFFFF 9.81%, #EBF4FF 51.76%, #FFFFFF 93.7%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#59B0031A] text-[#59B003] rounded-full font-medium text-sm">
            Professional jamoa
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Tajribali <span className="text-[#1F61F9]">mutaxassislar</span>{" "}
            jamoasi
          </h2>
          <p className="text-slate-500 text-lg">
            Bizning shifokorlar xalqaro sertifikatlarga ega va minglab
            bolalarning sog'lom rivojlanishiga hiss qo'shgan
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => {
            const photoUrl = member.photo
              ? member.photo.startsWith("http")
                ? member.photo
                : MEDIA_URL + member.photo
              : null;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-start text-left group"
              >
                {/* Photo */}
                <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-gradient-to-b from-[#E8EFF9] to-[#F4F7FC] mb-5 shadow-sm">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-bold text-blue-200">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-[17px] font-bold text-slate-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-[14px] font-semibold text-[#1F61F9] mb-0.5">
                  {member.specialty}
                </p>
                <p className="text-[13px] text-slate-400">
                  {member.experience_years} yillik tajriba
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
