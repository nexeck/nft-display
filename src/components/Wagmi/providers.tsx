"use client";

import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import * as React from "react";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { SessionProvider } from "next-auth/react";

import { chains, config } from "../../wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { isDarkMode } = useDarkMode();

  return (
    <WagmiConfig config={config}>
      <SessionProvider refetchInterval={0}>
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider theme={isDarkMode ? darkTheme() : lightTheme()} chains={chains}>
            {mounted && children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
