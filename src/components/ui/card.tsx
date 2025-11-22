import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5",
        className
      )}
      {...props}
    />
  );
}
'use client';
