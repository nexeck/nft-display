"use client";

import { useAccount } from "wagmi";

export function Connected({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });

  if (!isConnected) return null;
  return <>{children}</>;
}
