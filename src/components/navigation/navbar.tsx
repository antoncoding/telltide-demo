'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image
            src="/imgs/logo.png"
            alt="Tell Tide"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-semibold text-white">Tell Tide</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/setup"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/setup"
                ? "bg-sky-500/10 text-sky-300"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Builder
          </Link>
          <Link
            href="/demo-callback"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/demo-callback"
                ? "bg-sky-500/10 text-sky-300"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
