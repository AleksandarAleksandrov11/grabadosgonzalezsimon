"use client";

import dynamic from "next/dynamic";
import type { LiteProduct } from "@/lib/commerce/catalog-lite";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { StoreHydrator } from "@/lib/store/hydration";
import { Toaster } from "@/components/ui/Toaster";
import { CookieBanner, WhatsAppButton } from "./Floating";
import { MobileMenu } from "./MobileMenu";
import { FlyToCart } from "./FlyToCart";
import type { ReactNode } from "react";

// Overlays que no hacen falta en el primer pintado: chunk aparte.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer), {
  ssr: false,
});
const SearchOverlay = dynamic(() => import("./SearchOverlay").then((m) => m.SearchOverlay), { ssr: false });
const QuickView = dynamic(() => import("@/components/shop/QuickView").then((m) => m.QuickView), {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}

export function GlobalUI({ searchIndex, giftBox }: { searchIndex: LiteProduct[]; giftBox: LiteProduct }) {
  return (
    <>
      <StoreHydrator />
      <SmoothScroll />
      <CustomCursor />
      <MobileMenu />
      <CartDrawer giftBox={giftBox} />
      <SearchOverlay index={searchIndex} />
      <QuickView />
      <FlyToCart />
      <WhatsAppButton />
      <CookieBanner />
      <Toaster />
    </>
  );
}
