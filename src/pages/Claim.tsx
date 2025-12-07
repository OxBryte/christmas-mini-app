import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { getGift, updateGift } from "../utils/storage";
import { formatEther } from "viem";

export default function Claim() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [giftId, setGiftId] = useState(id || "");
  const [gift, setGift] = useState(getGift(giftId));
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "verify" | "claim">(id ? "verify" : "input");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (id) {
      const foundGift = getGift(id);
      setGift(foundGift);
      setGiftId(id);
      if (foundGift) {
        setStep("verify");
      }
    }
  }, [id]);

  const handleIdSubmit = () => {
    if (!giftId) {
      setError("Please enter a gift ID");
      return;
    }

    const foundGift = getGift(giftId);
    if (!foundGift) {
      setError("Gift not found");
      return;
    }

    if (foundGift.claimed) {
      setError("This gift has already been claimed");
      return;
    }

    setGift(foundGift);
    setError("");
    setStep("verify");
  };

  const handlePinVerify = () => {
    if (!pin) {
      setError("Please enter the PIN");
      return;
    }

    if (!gift) {
      setError("Gift not found");
      return;
    }

    if (pin !== gift.pin) {
      setError("Incorrect PIN");
      return;
    }

    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    setError("");
    setStep("claim");
  };

  const handleClaim = () => {
    if (!gift || !address) return;

    setIsPending(true);

    // Note: In production, this would claim from an escrow contract
    // For demo purposes, we'll mark it as claimed
    // The actual ETH would be sent from the contract to the claimer
    setTimeout(() => {
      updateGift(gift.id, {
        claimed: true,
        claimedBy: address,
        claimedAt: Date.now(),
      });

      // Update local state
      setGift({ ...gift, claimed: true, claimedBy: address, claimedAt: Date.now() });
      setIsPending(false);

      // Redirect after showing success
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 1000);
  };

  if (step === "input") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Claim Your Gift 🎁</h1>
          <p className="text-gray-400 text-center mb-8">Enter the gift ID to claim</p>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gift ID
              </label>
              <input
                type="text"
                value={giftId}
                onChange={(e) => setGiftId(e.target.value)}
                placeholder="Enter gift ID"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleIdSubmit}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "verify" && gift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Enter PIN 🔐</h1>
          <p className="text-gray-400 text-center mb-8">Enter the PIN to claim your gift</p>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Gift Amount</div>
              <div className="text-2xl font-bold text-white">
                {formatEther(BigInt(gift.amount))} ETH
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Claim PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {!isConnected && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-yellow-400 text-sm">
                Please connect your wallet to claim
              </div>
            )}

            <button
              onClick={handlePinVerify}
              disabled={!isConnected}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "claim" && gift) {
    const isClaimed = gift.claimed;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">
            {isClaimed ? "🎉 Gift Claimed!" : "Claim Your Gift"}
          </h1>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            {isClaimed ? (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-lg text-green-400 font-medium">
                  {formatEther(BigInt(gift.amount))} ETH has been claimed!
                </p>
                <p className="text-sm text-gray-400">
                  In production, this amount would be sent to your wallet from the escrow contract.
                </p>
                <p className="text-sm text-gray-400">
                  Redirecting to home page...
                </p>
              </div>
            ) : (
              <>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Claiming Amount</div>
                  <div className="text-2xl font-bold text-white">
                    {formatEther(BigInt(gift.amount))} ETH
                  </div>
                </div>

                <p className="text-sm text-gray-400 text-center">
                  Click below to claim your gift. In production, this would trigger a transaction 
                  from the escrow contract to your wallet.
                </p>

                <button
                  onClick={handleClaim}
                  disabled={isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isPending ? "Claiming..." : "Claim Gift"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

