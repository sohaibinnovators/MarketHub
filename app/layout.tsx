import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { ExperienceProvider } from "@/lib/experience";
import { MarketplaceProvider } from "@/lib/marketplace";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MarketHub — One Marketplace. Endless Possibilities.",
    template: "%s | MarketHub",
  },
  description:
    "MarketHub is a premium multi-vendor marketplace demo for discovering products from trusted sellers across multiple categories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-text">
        <MarketplaceProvider>
          <StoreProvider>
            <ExperienceProvider>{children}</ExperienceProvider>
          </StoreProvider>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
