import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Phone } from "lucide-react";
import Logo from "@/assets/images/logo.png";
import LoginIllustration from "@/assets/images/Rectangle 20.png";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/auth";
import { IMaskInput } from "react-imask";
import { useLogin } from "@/hooks/auth/useLogin";

export default function Login() {
  const { mutate: loginMutation, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const { control, register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginSchema) => {
    loginMutation({
      username: data.phone.replace(/\s/g, ""), // Remove spaces from phone
      password: data.password,
    });
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
                      unmask={false} // Match what's displayed for validation or mask logic
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
            <Button
                type="submit"
                disabled={isPending}
                className={`w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-3xl text-white font-bold text-base shadow-lg shadow-blue-100 transition-all mt-4 ${isPending ? "opacity-70 cursor-not-allowed" : ""}`}
            >
                {isPending ? "Yuklanmoqda..." : "Kirish"}
            </Button>
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
    </div>
  );
}

// Minimal Button component to avoid dependency issues if Shadcn Button is complex
function Button({ className, children, ...props }: any) {
    return (
        <button 
            className={`flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
