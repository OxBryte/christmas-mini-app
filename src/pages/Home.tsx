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
          <h1 className="text-4xl font-bold mb-2">🎄 Christmas Gift App</h1>
          <p className="text-gray-400">Connect your wallet to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎄 Christmas Gift App</h1>
        <p className="text-gray-400">Gift your loved ones this Christmas</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Step 1: Sign Message</h2>
          <SignButton required onSigned={() => setHasSigned(true)} />
        </div>

        {hasSigned && (
          <button
            onClick={() => navigate("/create")}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-lg"
          >
            🎁 Create a Gift
          </button>
        )}
      </div>
    </div>
  );
}

