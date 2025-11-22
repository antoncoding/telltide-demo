import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Navbar } from "@/components/navigation/navbar";

const font = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Tell Tide | Meta-event subscriptions",
  description:
    "Tell Tide lets you monitor Morpho markets, ERC4626 vaults, and ERC20 flows with intelligent meta-event detection."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.variable} bg-[hsl(var(--background))] text-[hsl(var(--foreground))]`}>
        <Providers>
          <Navbar />
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
