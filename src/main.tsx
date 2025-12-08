import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { AppKitProvider } from "@reown/appkit/react";
import App from "./App.tsx";
import { config } from "./config/wagmi.ts";

import "./index.css";
import { base } from "viem/chains";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <AppKitProvider
        projectId="33df6a21ce6237ff3dfb82d3cd1d2c77"
        networks={[base]}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AppKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);
