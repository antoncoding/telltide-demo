'use client';

import type { ReactNode } from "react";
import { useMemo } from "react";
import { AppKitProvider as ReownAppKitProvider } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit-common";
import { arbitrum, base, mainnet, optimism, sepolia } from "viem/chains";

const networks = [mainnet, base, optimism, arbitrum, sepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[]
];

const metadata = {
  name: "Tell Tide",
  description: "Meta-event subscriptions for ERC20 + ERC4626 flows.",
  url: "https://telltide.local",
  icons: ["https://avatars.githubusercontent.com/u/37784886?s=200&v=4"]
};

interface Props {
  children: ReactNode;
}

export function AppKitProvider({ children }: Props) {
  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

  const wagmiAdapter = useMemo(() => {
    if (!projectId) return undefined;
    return new WagmiAdapter({ networks, projectId });
  }, [projectId]);

  if (!projectId || !wagmiAdapter) {
    return (
      <>
        <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          Missing NEXT_PUBLIC_REOWN_PROJECT_ID. Update your .env.local to enable wallet
          connections.
        </div>
        {children}
      </>
    );
  }

  return (
    <ReownAppKitProvider
      adapters={[wagmiAdapter]}
      metadata={metadata}
      networks={networks}
      defaultNetwork={networks[0]}
      projectId={projectId}
      themeMode="dark"
      enableNetworkSwitch
      features={{ analytics: true, email: true, socials: ["google", "github"], swaps: true }}
    >
      {children}
    </ReownAppKitProvider>
  );
}
