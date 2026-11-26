import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedTuitions } from "@/components/home/featured-tuitions";
import PricingSection from "@/components/home/pricing-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Animated Hero Banner Slider */}
        <HeroCarousel />

        {/* Homepage Statistics */}
        <StatsSection />

        {/* Featured Tuition Opportunities */}
        <FeaturedTuitions />

        {/* Pricing Plans */}
        <PricingSection />
      </main>

      <Footer />
    </>
  );
}