import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Logo from "@/assets/images/logo.png"
import type { ContactInfo } from "@/types/landing.types";

interface FooterProps {
  contactInfo?: ContactInfo;
}

export const Footer = ({ contactInfo }: FooterProps) => {
  const { t } = useTranslation();
  return (
      <footer className="w-full px-[32px] bg-white pt-16 md:pt-20 pb-10 border-t border-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 md:mb-20">
          {/* Logo & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
                    <img src={Logo} alt="Neuroland Logo" className="w-[63px] h-[63px] object-contain" />      
            </div>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-[280px]">
              {t("footer.description")}
            </p>
          </motion.div>

          {/* Platforma */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8">{t("footer.platformTitle")}</h4>
            <ul className="space-y-3 md:space-y-4">
              {(t("footer.platformLinks", { returnObjects: true }) as string[]).map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    className="text-slate-400 text-base md:text-lg hover:text-[#1F61F9] transition-colors inline-block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Yordam */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8">{t("footer.helpTitle")}</h4>
            <ul className="space-y-3 md:space-y-4">
              {(t("footer.helpLinks", { returnObjects: true }) as string[]).map((item) => (
                <li key={item}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    className="text-slate-400 text-base md:text-lg hover:text-[#1F61F9] transition-colors inline-block"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Login */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8">{t("footer.contactTitle")}</h4>
            <ul className="space-y-3 md:space-y-4">
              {contactInfo?.email && (
                <li className="flex items-center gap-3 text-slate-400 text-base md:text-lg">
                  <Mail size={18} className="text-[#1F61F9]" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-[#1F61F9] transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-center gap-3 text-slate-400 text-base md:text-lg">
                  <Phone size={18} className="text-[#1F61F9]" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-[#1F61F9] transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-center gap-3 text-slate-400 text-base md:text-lg">
                  <MapPin size={18} className="text-[#1F61F9]" />
                  <span>{contactInfo.address}</span>
                </li>
              )}
            </ul>

            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              {t("footer.login")}
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 font-medium text-sm md:text-base">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};
