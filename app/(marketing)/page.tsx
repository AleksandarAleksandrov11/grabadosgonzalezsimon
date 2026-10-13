import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { OccasionsMarquee } from "@/components/home/OccasionsMarquee";
import { Intro } from "@/components/home/Intro";
import { QuickEngraver } from "@/components/home/QuickEngraver";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OccasionsBento } from "@/components/home/OccasionsBento";
import { TechniquePinned } from "@/components/home/TechniquePinned";
import { Benefits } from "@/components/home/Benefits";
import { BusinessBlock } from "@/components/home/BusinessBlock";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { OrderSteps } from "@/components/home/OrderSteps";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { HomeFaq } from "@/components/home/HomeFaq";
import { FinalCTA } from "@/components/home/FinalCTA";
import { allProducts } from "@/lib/commerce/local-provider";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} · Grabado en cristal con chorro de arena en Madrid`,
  absoluteTitle: true,
  description:
    "Grabado artesanal en cristal en Madrid: vasos, copas, jarras, jarrones, metopas y trofeos personalizados con chorro de arena. Personaliza el tuyo online y pide para bodas, empresas y regalos.",
  path: "/",
});

export default function HomePage() {
  const products = allProducts();
  const byTag = (t: string) => products.filter((p) => p.tags.includes(t)).slice(0, 8);
  const lists = {
    best: products.slice(0, 8),
    boda: byTag("boda"),
    empresa: byTag("empresa"),
    regalo: byTag("regalo"),
  };
  return (
    <>
      <Hero />
      <OccasionsMarquee />
      <Intro />
      <QuickEngraver />
      <FeaturedProducts lists={lists} />
      <OccasionsBento />
      <TechniquePinned />
      <Benefits />
      <BusinessBlock />
      <StoryTeaser />
      <OrderSteps />
      <Gallery />
      <Testimonials />
      <HomeFaq />
      <FinalCTA />
    </>
  );
}
