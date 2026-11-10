import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyUs from "@/components/WhyUs";
import Services from "@/components/Services";
import PricingStrip from "@/components/PricingStrip";
import CtaBanner from "@/components/CtaBanner";
import DisasterCards from "@/components/DisasterCards";
import Gallery from "@/components/Gallery";
import Team from "@/components/Team";
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
      <Navbar content={content} />
      <Hero content={content} />
      <WhyUs content={content} />
      <Services content={content} />
      <PricingStrip content={content} />
      <CtaBanner content={content} />
      <DisasterCards content={content} />
      <Gallery content={content} />
      <Team content={content} />
      <FaqSection content={content} />
      <QuoteSection content={content} />
      <ServiceAreas />
      <Footer content={content} />
    </>
  );
}
