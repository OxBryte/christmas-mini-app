import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { base, mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = "33df6a21ce6237ff3dfb82d3cd1d2c77";

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [base, mainnet],
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [base, mainnet],
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as any}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
