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
  return (
    <div className="min-h-screen mx-auto pt-0 lg:pt-[32px] w-full bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <main className="flex flex-col ">
        <div className="mx-auto lg:px-[32px]">
          <HeroSection />
          <AboutSection />
          <ValuesSection />
        </div>
        
        <TeamSection />
        <HowItWorksSection />
        <PlatformSection />
        <SuccessStoriesSection />
        <ProblemSolutionSection />
        
        <div className="mx-auto lg:px-[32px]">
            <GallerySection />
            <ReviewsSection />
            <FaqSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainLanding;
