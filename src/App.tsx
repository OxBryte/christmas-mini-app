import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";

import Layout from "./components/Layout";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <Layout>
        <div className="">
          <div className="text-2xl font-bold">
            Mini App + Vite + TS + React + Wagmi, yelloooo
          </div>
        </div>
      </Layout>
    </>
  );
}

export default App;
