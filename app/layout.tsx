import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/data/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalUI, Providers } from "@/components/layout/GlobalUI";
import { JsonLd } from "@/components/seo/JsonLd";
import { giftBoxLite, searchIndex } from "@/lib/commerce/catalog-lite";
import { localBusinessJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Grabado en cristal con chorro de arena en Madrid`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "grabado en cristal Madrid",
    "vasos grabados Madrid",
    "copas grabadas boda",
    "cristalería grabada personalizada",
    "grabado chorro de arena",
    "trofeos de cristal personalizados",
    "copas personalizadas comunión",
    "cristalería con logo empresa",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
    title: `${site.name} · Grabado en cristal con chorro de arena`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={fontVariables} suppressHydrationWarning>
      <body className="theme-light flex min-h-dvh flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="contenido" tabIndex={-1} className="-mt-[var(--header-h)] flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <GlobalUI searchIndex={searchIndex()} giftBox={giftBoxLite()} />
        </Providers>
        <JsonLd data={[localBusinessJsonLd(), organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
