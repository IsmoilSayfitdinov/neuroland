import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const brandName = "NEUROLAND";

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 1.0 + i * 0.07,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-100 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #FAFCFF 0%, #EEF2FF 30%, #E8F0FE 60%, #F8FAFF 100%)",
      }}
    >
      {/* Animated mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-[#1F61F9]/[0.04] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 30, -50, 0],
            scale: [1, 0.8, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-[#818CF8]/[0.04] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1F61F9]/[0.03] rounded-full blur-[120px]"
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(31, 97, 249, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 97, 249, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center">
        {/* Logo area */}
        <div className="relative mb-12">
          {/* Orbit ring 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 1, delay: 0.2 },
              scale: { duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            }}
            className="absolute -inset-10"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle
                cx="100" cy="100" r="95"
                fill="none"
                stroke="#1F61F9"
                strokeWidth="0.5"
                opacity="0.15"
                strokeDasharray="4 8"
              />
              {/* Orbit dot */}
              <circle cx="100" cy="5" r="3" fill="#1F61F9" opacity="0.3" />
            </svg>
          </motion.div>

          {/* Orbit ring 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -360 }}
            transition={{
              opacity: { duration: 1, delay: 0.4 },
              scale: { duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            }}
            className="absolute -inset-16"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle
                cx="100" cy="100" r="98"
                fill="none"
                stroke="#1F61F9"
                strokeWidth="0.3"
                opacity="0.08"
                strokeDasharray="2 12"
              />
              <circle cx="195" cy="80" r="2" fill="#3B82F6" opacity="0.25" />
            </svg>
          </motion.div>

          {/* Logo glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.12, 0.06], scale: [0.5, 1.1, 1] }}
            transition={{ duration: 2, delay: 0.3 }}
            className="absolute -inset-4 bg-[#1F61F9] rounded-3xl blur-2xl"
          />

          {/* Logo glass card */}
          <motion.div
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(238,242,255,0.8) 100%)",
              boxShadow: "0 8px 40px rgba(31, 97, 249, 0.12), 0 0 0 1px rgba(31, 97, 249, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
              backdropFilter: "blur(20px)",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 100 100"
              fill="none"
              className="md:w-16 md:h-16"
            >
              <motion.path
                d="M25 78V22L75 78V22"
                stroke="url(#logoGrad2)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.4,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.4,
                }}
              />
              <defs>
                <linearGradient id="logoGrad2" x1="25" y1="22" x2="75" y2="78" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1F61F9" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Shine effect */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.5, delay: 1.6, ease: "easeInOut" }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent rounded-3xl skew-x-[-20deg]"
            />
          </motion.div>
        </div>

        {/* Brand text */}
        <div className="text-center">
          {/* Staggered letters */}
          <div className="flex justify-center perspective-[800px]">
            {brandName.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="text-[22px] md:text-[28px] font-semibold tracking-[0.3em] text-[#1F61F9] inline-block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Animated underline */}
          <div className="relative mt-4 flex justify-center">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-32 origin-center"
              style={{
                background: "linear-gradient(90deg, transparent, #1F61F9, transparent)",
                opacity: 0.3,
              }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-[10px] md:text-[11px] text-slate-400 mt-3 tracking-[0.35em] font-medium"
          >
            {t("loading.subtitle")}
          </motion.p>
        </div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="mt-12 flex items-center gap-1.5"
        >
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#1F61F9]"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
