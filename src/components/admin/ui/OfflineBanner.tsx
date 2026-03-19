import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-9999 bg-[#EF4444] text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <WifiOff className="w-4 h-4" />
          <span className="text-[13px] font-medium">Internet aloqasi yo'q. Keshlangan ma'lumotlar ko'rsatilmoqda.</span>
        </motion.div>
      )}
      {showBackOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-9999 bg-[#10B981] text-white py-2 px-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <Wifi className="w-4 h-4" />
          <span className="text-[13px] font-medium">Internet aloqasi tiklandi.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
