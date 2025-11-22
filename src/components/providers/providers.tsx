'use client';

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppKitProvider } from "@/components/providers/appkit-provider";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <AppKitProvider>{children}</AppKitProvider>
    </QueryClientProvider>
  );
}
