import { useState } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageBannerPeople from "@/assets/images/bannerImagePeoples.png"
import { Navbar } from "./Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const consultationSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  childAge: z.string().optional(),
  message: z.string().optional(),
});

type ConsultationForm = z.infer<typeof consultationSchema>;

export const HeroSection = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationForm>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = (_data: ConsultationForm) => {
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      reset();
    }, 2000);
  };

  return (
    <section
      className="relative mx-auto lg:rounded-[30px] 2xl:h-[720px] 3xl:h-full px-4 md:px-[32px] pt-4 md:pt-[32px] overflow-hidden max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1920px]"
      style={{
        background: "linear-gradient(108.32deg, rgba(31, 97, 249, 0.1) 0%, rgba(89, 176, 3, 0.1) 111.59%)"
      }}
    >
      <Navbar/>
      <div className="mt-8 md:mt-[80px] 2xl:mt-[40px] 3xl:mt-[80px] px-[32px]">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-green-100/30 rounded-full blur-[100px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8 2xl:space-y-6 3xl:space-y-8"
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F61F90D] text-[#1F61F9] rounded-full text-xs font-bold border border-[#1F61F933]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F61F9] animate-pulse" />
              {t("hero.badge")}
            </motion.div>

            {/* Headline */}
            <h1 className="text-[32px] md:text-[45px] 2xl:text-[42px] 3xl:text-[60px] font-extrabold leading-[1.2] md:leading-[1.1] tracking-tight text-slate-900">
              <Trans
                i18nKey="hero.title"
                components={{ highlight: <span className="text-[#1F61F9]" /> }}
              />
            </h1>

            {/* Description */}
            <p className="text-base md:text-[18px] text-[#65758B] max-w-lg leading-relaxed font-medium">
              {t("hero.description")}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(true)}
                className="bg-[#1F61F9] hover:bg-[#1F61F9] text-white px-6 md:px-8 py-3 md:py-4 rounded-[24px] font-semibold text-base md:text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform cursor-pointer w-full md:w-auto"
              >
                {t("hero.cta")}
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12 2xl:gap-8 3xl:gap-12 pb-9 2xl:pb-6 3xl:pb-9 overflow-x-auto md:overflow-visible no-scrollbar" >
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">500+</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t("hero.activeUsers")}</p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">50+</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t("hero.clinics")}</p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">98%</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{t("hero.trust")}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:flex hidden lg:mt-[130px] mt-[30px] items-center justify-center lg:justify-end w-full"
          >
            <div className="relative min-h-[300px] md:min-h-[420px] xl:min-h-[480px] 2xl:min-h-[450px] 3xl:min-h-[594px] w-full lg:min-w-[500px] xl:min-w-[560px] 3xl:min-w-[630px] aspect-square md:aspect-[4/3]">
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

      {/* Consultation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[20px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {t("consultation.title")}
            </DialogTitle>
            <DialogDescription className="text-[#65758B]">
              {t("consultation.description")}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center text-sm text-slate-600 font-medium">
                {t("consultation.success")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("consultation.name")}</Label>
                <Input
                  id="name"
                  placeholder={t("consultation.namePlaceholder")}
                  className={`rounded-xl ${errors.name ? "border-red-500" : ""}`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{t("consultation.name")} *</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("consultation.phone")}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("consultation.phonePlaceholder")}
                  className={`rounded-xl ${errors.phone ? "border-red-500" : ""}`}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{t("consultation.phone")} *</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="childAge">{t("consultation.childAge")}</Label>
                <Input
                  id="childAge"
                  placeholder={t("consultation.childAgePlaceholder")}
                  className="rounded-xl"
                  {...register("childAge")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("consultation.message")}</Label>
                <textarea
                  id="message"
                  placeholder={t("consultation.messagePlaceholder")}
                  rows={3}
                  className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  {...register("message")}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1F61F9] hover:bg-[#1a54d9] text-white py-3 rounded-xl font-semibold text-base transition-colors cursor-pointer"
              >
                {t("consultation.submit")}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
