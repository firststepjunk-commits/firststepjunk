import Navbar from "@/components/Navbar";
import SeasonalBanner from "@/components/SeasonalBanner";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
import Services from "@/components/Services";
import WeHaul from "@/components/WeHaul";
import MobileStickyBar from "@/components/MobileStickyBar";
import DesktopFloatingQuote from "@/components/DesktopFloatingQuote";
import RigSection from "@/components/RigSection";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import PricingStrip from "@/components/PricingStrip";
import Gallery from "@/components/Gallery";
import Team from "@/components/Team";
import MeetMike from "@/components/MeetMike";
import FaqSection from "@/components/FaqSection";
import QuoteSection from "@/components/QuoteSection";
import ServiceAreas from "@/components/ServiceAreas";
import Footer from "@/components/Footer";
import { getContent } from "@/lib/content";

// Read live content at request time so owner edits (via /settings) appear for
// every visitor. Falls back to bundled defaults when no edits are stored.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  return (
    <>
      <SeasonalBanner />
      <Navbar content={content} />
      <Hero content={content} />
      <Reviews />
      <Services />
      <WeHaul />
      <RigSection />
      <Process />
      <PricingStrip content={content} />
      <WhyUs content={content} />
      <Gallery content={content} />
      <Team content={content} />
      <MeetMike />
      <FaqSection content={content} />
      <QuoteSection content={content} />
      <ServiceAreas />
      <Footer content={content} />
      {/* Sticky mobile bar (mobile only) + a same-height spacer in the
          footer's dark green so the bar never covers footer content. */}
      <MobileStickyBar />
      <DesktopFloatingQuote />
      <div aria-hidden="true" className="h-16 bg-primary md:hidden" />
    </>
  );
}
