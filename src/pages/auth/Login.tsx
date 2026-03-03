import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Logo from "@/assets/images/logo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/auth";

import { useAuthStore } from "@/store/useAuthStore";
import Role from "@/types/auth";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginSchema) => {
    // Mocking a successful login for demonstration based on username
    let role: Role = Role.SPECIALIST; // Default for testing
    
    if (data.username.includes("admin")) {
      role = Role.ADMIN;
    } else if (data.username.includes("parent")) {
      role = Role.PARENT;
    }

    login({ username: data.username, role }, "mock-token");

    // Role-based redirection
    if (role === Role.ADMIN) {
      navigate({ to: "/admin" }); // Assuming an admin route exists or will exist
    } else if (role === Role.SPECIALIST) {
      navigate({ to: "/specialist/dashboard" });
    } else if (role === Role.PARENT) {
      navigate({ to: "/parent" });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={Logo} alt="Neuroland" className="h-10" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">
            Xush kelibsiz!
          </h1>
          <p className="text-slate-500 text-center text-sm mb-8">
            Davom etish uchun tizimga kiring
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Foydalanuvchi nomi
              </label>
              <input
                type="text"
                {...register("username")}
                placeholder="username"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 placeholder-slate-400 text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn size={18} />
              Kirish
            </motion.button>
          </form>
        </div>

        {/* Back to home */}
        <p className="text-center text-sm text-slate-500 mt-6">
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-blue-600 hover:underline font-medium"
          >
            ← Bosh sahifaga qaytish
          </button>
        </p>
      </motion.div>
    </div>
  );
}
