import { motion } from "framer-motion";

const doctors = [
  {
    id: 1,
    name: "Dr. Alisher Rahimov",
    role: "Bolalar nevropatologi",
    experience: "15 yillik tajriba",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    name: "Dr. Malika Karimova",
    role: "Defektolog",
    experience: "10 yillik tajriba",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    name: "Dr. Jamshid Sobirov",
    role: "Bolalar psixologi",
    experience: "12 yillik tajriba",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    name: "Dr. Laylo Tursunova",
    role: "Logoped",
    experience: "8 yillik tajriba",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    name: "Dr. Bekzod Alimov",
    role: "Neyrofizolog",
    experience: "14 yillik tajriba",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
];

export const TeamSection = () => {
    // Duplicate array multiple times for seamless scrolling
    const marqueeDoctors = [...doctors, ...doctors, ...doctors, ...doctors, ...doctors, ...doctors];

  return (
    <section
      id="team"
      className="w-full py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(193.72deg, #FFFFFF 9.81%, #EBF4FF 51.76%, #FFFFFF 93.7%)",
      }}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#59B0031A] text-[#59B003] rounded-full font-medium text-sm">
            Professional jamoa
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Tajribali <span className="text-[#1F61F9]">mutaxassislar</span> jamoasi
          </h2>
          <p className="text-slate-500 text-lg">
            Bizning shifokorlar xalqaro sertifikatlarga ega va minglab
            bolalarning sog'lom rivojlanishiga hiss qo'shgan
          </p>
        </div>

        {/* Marquee Container */}
        <div className="w-full relative overflow-hidden">
            {/* Gradient Masks */}

            <div className="flex overflow-hidden">
                <motion.div
                    className="flex gap-8 px-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 60,
                    }}
                    style={{ width: "fit-content" }}
                >
                    {marqueeDoctors.map((doctor, index) => (
                        <div
                            key={`${doctor.id}-${index}`}
                             className="w-[280px] md:w-[320px] flex-shrink-0 group cursor-pointer"
                        >
                            <div className="rounded-[32px] overflow-hidden transition-all duration-300">
                                {/* Image Container */}
                                <div className="relative aspect-[6/7] bg-slate-200 rounded-[32px] overflow-hidden mb-6">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                </div>

                                {/* Content */}
                                <div className="text-left px-2">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        {doctor.name}
                                    </h3>
                                    <p className="text-[#1F61F9] font-medium mb-1">
                                        {doctor.role}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {doctor.experience}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
      </div>
    </section>
  );
};
