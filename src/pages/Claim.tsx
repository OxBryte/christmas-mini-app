import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useGetGift } from "../hooks/useGetGift";
import { useClaimGift } from "../hooks/useClaimGift";
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { decodeGiftId, isValidGiftIdCode } from "../utils/giftId";

export default function Claim() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [giftIdInput, setGiftIdInput] = useState(id || "");
  const [giftId, setGiftId] = useState<bigint | undefined>(
    id ? BigInt(id) : undefined
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "verify" | "claim">(
    id ? "verify" : "input"
  );

  const {
    gift,
    isLoading: isLoadingGift,
    error: giftError,
    refetch,
  } = useGetGift(giftId);
  const {
    claimGift,
    isPending: isClaiming,
    error: claimError,
  } = useClaimGift();
  const [claimHash, setClaimHash] = useState<`0x${string}` | undefined>();
  const { isLoading: isConfirming, isSuccess: isClaimSuccess } =
    useWaitForTransactionReceipt({
      hash: claimHash,
    });

  // Update giftId when id param changes
  useEffect(() => {
    if (id) {
      const decoded = decodeGiftId(id);
      if (decoded !== null) {
        setGiftId(decoded);
        setGiftIdInput(id);
        setStep("verify");
      } else {
        setError("Invalid gift ID format");
      }
    }
  }, [id]);

  // Refetch gift after successful claim
  useEffect(() => {
    if (isClaimSuccess && giftId) {
      refetch();
    }
  }, [isClaimSuccess, giftId, refetch]);

  // Handle gift errors
  useEffect(() => {
    if (giftError) {
      setError("Failed to load gift. Please check the gift ID.");
    }
  }, [giftError]);

  // Handle claim errors
  useEffect(() => {
    if (claimError) {
      setError(claimError.message || "Failed to claim gift");
    }
  }, [claimError]);

  const handleIdSubmit = () => {
    setError("");

    if (!giftIdInput) {
      setError("Please enter a gift ID");
      return;
    }

    // Validate and decode the 6-character code
    const cleaned = giftIdInput.trim().toLowerCase();
    if (!isValidGiftIdCode(cleaned)) {
      setError("Gift ID must be 6 characters (letters and numbers)");
      return;
    }

    const decoded = decodeGiftId(cleaned);
    if (decoded === null) {
      setError("Invalid gift ID format");
      return;
    }

    setGiftId(decoded);
    setGiftIdInput(cleaned);
    setStep("verify");
  };

  const handlePinVerify = () => {
    setError("");

    if (!pin) {
      setError("Please enter the PIN");
      return;
    }

    if (!gift) {
      setError("Gift not found");
      return;
    }

    if (gift.claimed) {
      setError("This gift has already been claimed");
      return;
    }

    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    setError("");
    setStep("claim");
  };

  const handleClaim = async () => {
    if (!gift || !address || !giftId) return;

    setError("");

    try {
      const hash = await claimGift(giftId, pin);
      setClaimHash(hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim gift");
    }
  };

  if (step === "input") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Claim Your Gift 🎁
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Enter the gift ID to claim
          </p>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gift ID
              </label>
              <input
                type="text"
                value={giftIdInput}
                onChange={(e) => {
                  // Only allow alphanumeric, max 6 characters
                  const value = e.target.value.toLowerCase().replace(/[^0-9a-z]/g, "").slice(0, 6);
                  setGiftIdInput(value);
                }}
                placeholder="Enter 6-character gift ID"
                maxLength={6}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg tracking-wider"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter the 6-character gift code
              </p>
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

  if (step === "verify") {
    if (isLoadingGift) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">Loading gift...</div>
            <p className="text-gray-400">Please wait</p>
          </div>
        </div>
      );
    }

    if (!gift) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-full max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Gift Not Found</h1>
            <p className="text-gray-400 mb-6">
              The gift ID you entered doesn't exist
            </p>
            <button
              onClick={() => {
                setGiftIdInput("");
                setGiftId(undefined);
                setStep("input");
                setError("");
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Another ID
            </button>
          </div>
        </div>
      );
    }

    if (gift.claimed) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h1 className="text-2xl font-bold mb-2">Gift Already Claimed</h1>
            <p className="text-gray-400 mb-6">
              This gift has already been claimed by {gift.claimedBy.slice(0, 6)}
              ...{gift.claimedBy.slice(-4)}
            </p>
            <button
              onClick={() => {
                setGiftIdInput("");
                setGiftId(undefined);
                setStep("input");
                setError("");
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Try Another Gift
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Enter PIN 🔐</h1>
          <p className="text-gray-400 text-center mb-8">
            Enter the PIN to claim your gift
          </p>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Gift Amount</div>
              <div className="text-2xl font-bold text-white">
                {formatEther(gift.amount)} ETH
              </div>
            </div>

            {gift.message && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">Message</div>
                <div className="text-white">{gift.message}</div>
              </div>
            )}

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

  if (step === "claim" && gift && giftId) {
    const isClaimed = gift.claimed;
    const isPending = isClaiming || isConfirming;

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
                  {formatEther(gift.amount)} ETH has been claimed!
                </p>
                <p className="text-sm text-gray-400">
                  The funds have been sent to your wallet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">
                    Claiming Amount
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {formatEther(gift.amount)} ETH
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {(isClaiming || isConfirming) && (
                  <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-blue-400 text-sm">
                    {isClaiming
                      ? "Waiting for transaction..."
                      : "Confirming transaction..."}
                  </div>
                )}

                <button
                  onClick={handleClaim}
                  disabled={isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isPending
                    ? isClaiming
                      ? "Claiming..."
                      : "Confirming..."
                    : "Claim Gift"}
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
