import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/providers/providers";

const font = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "Tell Tide | Meta-event subscriptions",
  description:
    "Tell Tide lets you monitor ERC20 + ERC4626 flows, connect wallets via Reown, and ship webhook-ready alerts in minutes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.variable} bg-[hsl(var(--background))] text-[hsl(var(--foreground))]`}>
        <Providers>
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
