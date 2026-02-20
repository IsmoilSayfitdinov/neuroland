import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/landing/LoadingScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { Footer } from "@/components/landing/Footer";
import { AboutSection } from "@/components/landing/AboutSection";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SuccessStoriesSection } from "@/components/landing/SuccessStoriesSection";
import { ProblemSolutionSection } from "@/components/landing/ProblemSolutionSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { FaqSection } from "@/components/landing/FaqSection";

function MainLanding() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for actual load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds for the "N" animation to show off
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <div className="min-h-screen mx-auto pt-0 lg:pt-[32px] w-full bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <main className="flex flex-col ">
          <div className="mx-auto lg:px-[32px] max-w-[1920px]">
            <HeroSection />
            <AboutSection />
            <ValuesSection />
          </div>
          
          <TeamSection />
          <HowItWorksSection />
          <PlatformSection />
          <SuccessStoriesSection />
          <ProblemSolutionSection />
          
          <div className="mx-auto max-w-7xl 2xl:max-w-7xl 3xl:max-w-[1920px]">
              <GallerySection />
              <ReviewsSection />
              <FaqSection />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default MainLanding;
