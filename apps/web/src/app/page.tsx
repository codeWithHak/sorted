import { Navbar } from "@/components/brand/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AgentShowcase } from "@/components/landing/AgentShowcase";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MeetJettSection } from "@/components/landing/MeetJettSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AgentShowcase />
        <HowItWorksSection />
        <MeetJettSection />
      </main>
      <Footer />
    </>
  );
}
