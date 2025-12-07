import { sdk } from "@farcaster/frame-sdk";
import { useEffect } from "react";
import ConnectMenu from "./components/ConnectMenu";

function App() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <>
      <div className="">
        <div className="flex items-center gap-2 justify-between w-full">
          <img src="/logo.png" alt="logo" className="w-10 h-10" />
          <ConnectMenu />
        </div>
        <div className="text-2xl font-bold">Mini App + Vite + TS + React + Wagmi, yelloooo</div>
      </div>
    </>
  );
}

export default App;
