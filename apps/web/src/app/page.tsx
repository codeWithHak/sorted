import { Navbar } from "@/components/brand/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MeetJettSection } from "@/components/landing/MeetJettSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { VisionSection } from "@/components/landing/VisionSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MeetJettSection />
        <HowItWorksSection />
        <VisionSection />
      </main>
      <Footer />
    </>
  );
}
