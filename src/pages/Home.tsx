import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import SignButton from "../components/SignButton";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [hasSigned, setHasSigned] = useState(false);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h1 className="text-[200px] font-bold">🎄</h1>
          <p className="text-gray-400">Connect your wallet to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="text-center flex flex-col items-center gap-2">
        <div className="p-12 flex items-center justify-center w-48 h-48 bg-orange-100 rounded-full">
          <img src="/gift.svg" alt="logo" className="w-full" />
        </div>
        <p className="text-xl font-semibold text-center max-w-[320px] mx-auto">
          Keep Your Inner Circle Closer, One Gift at a Time.
        </p>
      </div>

      <div className="w-full">
        <SignButton
          required
          onSigned={() => {
            setHasSigned(true);
            navigate("/create");
          }}
        />
      </div>
    </div>
  );
}
