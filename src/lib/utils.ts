import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TELLTIDE_API_BASE =
  process.env.NEXT_PUBLIC_TELLTIDE_API_URL ?? "http://localhost:3000";

export const DEMO_CALLBACK_URL =
  process.env.NEXT_PUBLIC_DEMO_CALLBACK_URL ??
  "http://localhost:3000/api/demo-callback";
