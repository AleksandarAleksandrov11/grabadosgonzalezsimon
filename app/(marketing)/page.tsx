import type { Metadata } from "next";
import { forCard } from "@/lib/commerce/catalog-lite";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { QuickEngraver } from "@/components/home/QuickEngraver";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OccasionsBento } from "@/components/home/OccasionsBento";
import { TechniquePinned } from "@/components/home/TechniquePinned";
import { BusinessBlock } from "@/components/home/BusinessBlock";
import { StoryTeaser } from "@/components/home/StoryTeaser";
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
    "Grabado artesanal en cristal en Madrid: vasos, copas, jarras, jarrones, metopas y trofeos personalizados con chorro de arena para bodas, empresas y regalos.",
  path: "/",
});

export default function HomePage() {
  const products = allProducts().map(forCard);
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedProducts products={products.slice(0, 6)} />
      <OccasionsBento />
      <QuickEngraver />
      <TechniquePinned />
      <BusinessBlock />
      <StoryTeaser />
      <Gallery />
      <Testimonials />
      <HomeFaq />
      <FinalCTA />
    </>
  );
}
