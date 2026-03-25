import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Phone, AlertTriangle, X, Rocket } from "lucide-react";
import Logo from "@/assets/images/logo.png";
import LoginIllustration from "@/assets/images/Rectangle 20.png";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { IMaskInput } from "react-imask";
import { useLogin } from "@/hooks/auth/useLogin";
import { useNavigate } from "@tanstack/react-router";
import Role from "@/types/auth";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const handleLoginSuccess = useCallback((role: Role) => {
    setPendingRole(role);
    setShowBetaModal(true);
  }, []);

  const { mutate: loginMutation, isPending } = useLogin(handleLoginSuccess);

  const { control, register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation({
      username: data.phone.replace(/\s/g, ""),
      password: data.password,
    });
  };

  const handleContinue = () => {
    setShowBetaModal(false);
    if (pendingRole === Role.ADMIN) {
      navigate({ to: "/admin" });
    } else if (pendingRole === Role.SPECIALIST) {
      navigate({ to: "/specialist" });
    } else if (pendingRole === Role.PARENT) {
      navigate({ to: "/parent" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Section: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px] flex flex-col">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img src={Logo} alt="Neuroland" className="h-20" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-10">
            Tizimga kirish
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Telefon raqam
              </label>
              <div className="relative group">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="+{998} 00 000 00 00"
                      value={field.value}
                      unmask={false}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="+998 99 999 99 99"
                      className="w-full bg-[#F8FAFC] border border-slate-100 px-6 py-4 rounded-3xl text-sm font-medium text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-100 transition-all pl-14"
                    />
                  )}
                />
                <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-[10px] font-bold ml-4 uppercase tracking-tighter">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Parol
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="123456"
                  className="w-full bg-[#F8FAFC] border border-slate-100 px-6 py-4 rounded-3xl text-sm font-medium text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-100 transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-bold ml-4 uppercase tracking-tighter">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-3xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isPending ? "Yuklanmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section: Illustration */}
      <div className="hidden lg:flex flex-1 p-8 items-center justify-center">
        <div className="w-full h-full bg-[#E5EEFF] rounded-[60px] relative overflow-hidden flex items-center justify-center bg-linear-to-br from-[#E2EDFF] to-[#E8F8EE]">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={LoginIllustration}
            alt="Secure Login Illustration"
            className="w-[80%] max-w-[338px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Beta Modal */}
      <AnimatePresence>
        {showBetaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleContinue} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-[28px] w-full max-w-[440px] overflow-hidden shadow-2xl"
            >
              {/* Top gradient */}
              <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

              <div className="p-8">
                {/* Close button */}
                <button
                  onClick={handleContinue}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>

                {/* Title */}
                <h2 className="text-[22px] font-bold text-[#2D3142] text-center mb-2">
                  Beta versiya
                </h2>
                <div className="flex justify-center mb-5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[11px] font-bold rounded-full uppercase tracking-wider">
                    v0.1 Beta
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 mb-6">
                  <p className="text-[14px] text-[#6B7A99] text-center leading-relaxed">
                    Siz hozir <span className="font-bold text-[#2D3142]">Neuroland</span> platformasining beta versiyasidan foydalanmoqdasiz.
                  </p>

                  <div className="bg-[#F8F9FB] rounded-[16px] p-4 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-500 text-[10px] font-bold">1</span>
                      </div>
                      <p className="text-[13px] text-[#6B7A99]">
                        Ba'zi funksiyalar hali to'liq ishlamasligi mumkin
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-500 text-[10px] font-bold">2</span>
                      </div>
                      <p className="text-[13px] text-[#6B7A99]">
                        Xatoliklar va kamchiliklar muntazam tuzatib boriladi
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-500 text-[10px] font-bold">3</span>
                      </div>
                      <p className="text-[13px] text-[#6B7A99]">
                        Yangi imkoniyatlar doimiy ravishda qo'shilmoqda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={handleContinue}
                  className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] rounded-[16px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Rocket className="w-4 h-4" />
                  Tushunarli, davom etish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
