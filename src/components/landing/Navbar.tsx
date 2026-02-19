import { useState, useEffect } from "react";
import { Menu, X, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/assets/images/logo.png"

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Biz haqimizda", href: "#about" },
    { name: "Platforma haqida", href: "#platform" },
    { name: "Bog'lanish", href: "#contact" },
  ];

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav
      className="bg-white max-w-[1312px] 2xl:max-w-[1750px] flex flex-col md:flex-row items-center justify-between mx-auto rounded-[24px] md:rounded-[100px] px-4 md:px-[32px] 2xl:px-[48px] py-3 md:py-0 relative z-50 transition-all duration-300"
    >
      <div className="w-full mx-auto flex items-center justify-between md:h-[70px] 2xl:h-[90px]">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <img src={Logo} alt="Neuroland Logo" className="h-8 md:h-auto 2xl:h-12 transition-all" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 2xl:gap-12 pl-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 hover:text-blue-600 font-medium text-sm md:text-base 2xl:text-xl transition-colors relative group whitespace-nowrap"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 2xl:px-10 py-2.5 2xl:py-4 rounded-full font-medium text-sm md:text-base 2xl:text-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-200 cursor-pointer">
            Tizimga kirish
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
           <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white/95 backdrop-blur-xl shadow-2xl z-[60] md:hidden p-6 flex flex-col gap-6 rounded-l-[2rem]"
            >
              <div className="flex justify-between items-center pl-2">
                <img src={Logo} alt="Neuroland Logo" className="h-8" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-red-500"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {navLinks.map((link) => (
                  <motion.a
                    variants={itemVariants}
                    key={link.name}
                    href={link.href}
                    className="text-slate-700 font-semibold text-lg p-4 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all flex items-center justify-between group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                    <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </motion.a>
                ))}
              </div>

              <motion.div variants={itemVariants} className="mt-auto space-y-6 pb-6">
                <button className="bg-blue-600 active:scale-95 text-white p-4 rounded-2xl font-bold w-full text-center shadow-lg shadow-blue-200 transition-all text-lg flex items-center justify-center gap-2">
                  Tizimga kirish
                </button>
                
                <div className="flex justify-center gap-6 pt-6 border-t border-slate-100">
                  <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-blue-50"><Facebook size={20} /></a>
                  <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors bg-slate-50 p-3 rounded-full hover:bg-pink-50"><Instagram size={20} /></a>
                  <a href="#" className="text-slate-400 hover:text-sky-500 transition-colors bg-slate-50 p-3 rounded-full hover:bg-sky-50"><Twitter size={20} /></a>
                  <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors bg-slate-50 p-3 rounded-full hover:bg-blue-50"><Linkedin size={20} /></a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
