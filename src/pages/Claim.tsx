import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useSimulateContract } from "wagmi";
import { useGetGift } from "../hooks/useGetGift";
import { useClaimGift } from "../hooks/useClaimGift";
import { useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { isValidGiftIdCode } from "../utils/giftId";
import { getGiftIdFromCode } from "../utils/giftCodeMapping";
import { hashPin } from "../hooks/utils";
import { contractAddress, contractABI } from "../constant/contractABI";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function Claim() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [giftIdInput, setGiftIdInput] = useState(id || "");
  const [giftId, setGiftId] = useState<bigint | undefined>(
    id ? getGiftIdFromCode(id) || undefined : undefined
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const confettiTriggered = useRef(false);
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
      const cleaned = id.trim().toLowerCase();
      if (isValidGiftIdCode(cleaned)) {
        const decoded = getGiftIdFromCode(cleaned);
        if (decoded !== null) {
          setGiftId(decoded);
          setGiftIdInput(cleaned);
          setStep("verify");
        } else {
          setError("Gift code not found");
        }
      } else {
        setError("Invalid gift code format");
      }
    }
  }, [id]);

  // Refetch gift after successful claim
  useEffect(() => {
    if (isClaimSuccess && giftId) {
      refetch();
    }
  }, [isClaimSuccess, giftId, refetch]);

  // Trigger confetti when gift is successfully claimed
  useEffect(() => {
    if (isClaimSuccess && gift && !confettiTriggered.current) {
      confettiTriggered.current = true;

      // Trigger confetti with Christmas colors
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Christmas colors: red and green
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isClaimSuccess, gift]);

  // Handle gift errors
  useEffect(() => {
    if (giftError) {
      setError("Failed to load gift. Please check the gift ID.");
    }
  }, [giftError]);

  // Handle claim errors
  useEffect(() => {
    if (claimError) {
      const errorMsg = claimError.message || "Failed to claim gift";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [claimError]);

  const [shouldVerifyPin, setShouldVerifyPin] = useState(false);

  // Simulate contract to verify PIN
  const {
    data: simulateData,
    error: simulateError,
    isLoading: isSimulating,
  } = useSimulateContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "claimGift",
    args: giftId && pin && shouldVerifyPin ? [giftId, hashPin(pin)] : undefined,
    query: {
      enabled: shouldVerifyPin && !!giftId && !!pin && !!address,
    },
  });

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

    const decoded = getGiftIdFromCode(cleaned);
    if (decoded === null) {
      setError("Gift code not found. Please check the code and try again.");
      return;
    }

    setGiftId(decoded);
    setGiftIdInput(cleaned);
    setStep("verify");
  };

  // Handle PIN verification result
  useEffect(() => {
    if (shouldVerifyPin && !isSimulating) {
      if (simulateError) {
        // PIN is incorrect or other error
        const errorMsg = "Invalid PIN. Please check and try again.";
        setError(errorMsg);
        toast.error(errorMsg);
        setShouldVerifyPin(false);
        setIsVerifyingPin(false);
      } else if (simulateData) {
        // PIN is correct, proceed to claim step
        setError("");
        setStep("claim");
        setShouldVerifyPin(false);
        setIsVerifyingPin(false);
      }
    }
  }, [shouldVerifyPin, isSimulating, simulateError, simulateData]);

  const handlePinVerify = () => {
    setError("");

    if (!pin) {
      const errorMsg = "Please enter the PIN";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!gift) {
      const errorMsg = "Gift not found";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (gift.claimed) {
      const errorMsg = "This gift has already been claimed";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!isConnected || !address) {
      const errorMsg = "Please connect your wallet";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!giftId) {
      const errorMsg = "Invalid gift ID";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Trigger PIN verification via simulation
    setIsVerifyingPin(true);
    setShouldVerifyPin(true);
  };

  const handleClaim = async () => {
    if (!gift || !address || !giftId) return;

    setError("");

    try {
      const hash = await claimGift(giftId, pin);
      setClaimHash(hash);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to claim gift";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (step === "input") {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Claim Your Gift 🎁
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Enter the gift ID to claim
          </p>

          <div className="bg-[#f2f2f2]/50 rounded-lg p-6 border border-gray-200 space-y-4">
            <div>
              {/* <label className="block text-sm font-medium mb-2">
                Gift ID
              </label> */}
              <input
                type="text"
                value={giftIdInput}
                onChange={(e) => {
                  // Only allow alphanumeric, max 6 characters
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^0-9a-z]/g, "")
                    .slice(0, 6);
                  setGiftIdInput(value);
                }}
                placeholder="Enter 6-character gift ID"
                maxLength={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg tracking-wider"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter the 6-character gift code
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-center border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleIdSubmit}
              className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <div className="text-center animate-pulse">
            <div className="text-2xl mb-2">Loading gift...</div>
            <p className="text-gray-400">Please wait</p>
          </div>
        </div>
      );
    }

    if (!gift) {
      return (
        <div className="flex flex-col items-center justify-center w-full gap-3">
          <div className="w-full text-center space-y-2">
            <h1 className="text-2xl font-bold">Gift Not Found</h1>
            <p className="text-gray-400">
              The gift ID you entered doesn't exist
            </p>
            <button
              onClick={() => {
                setGiftIdInput("");
                setGiftId(undefined);
                setStep("input");
                setError("");
              }}
              className="px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-400 mb-6 max-w-[320px] mx-auto">
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
              className="px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try Another Gift
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center">Enter PIN 🔐</h1>
          <p className="text-gray-400 text-center mb-8">
            Enter the PIN to claim your gift
          </p>

          <div className="bg-[#f2f2f2]/50 rounded-lg p-6 border border-gray-200 space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Gift Amount</div>
              <div className="text-2xl font-bold text-black">
                {formatEther(gift.amount)} ETH
              </div>
            </div>

            {gift.message && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Message</div>
                <div className="text-black capitalize">{gift.message}</div>
              </div>
            )}

            <div>
              {/* <label className="block text-sm font-medium mb-2">
                  Claim PIN
                </label> */}
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter claim PIN"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!isConnected && (
              <div className="bg-yellow-500/10 text-center border border-yellow-500 rounded-lg p-3 text-yellow-500 text-sm">
                Please connect your wallet to claim
              </div>
            )}

            <button
              onClick={handlePinVerify}
              disabled={!isConnected || isVerifyingPin}
              className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifyingPin ? "Verifying PIN..." : "Verify PIN"}
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
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-12 flex items-center justify-center w-48 h-48 bg-orange-100 rounded-full">
              <img src="/gift.svg" alt="logo" className="w-full" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center">
              {isClaimed ? "🎉 Gift Claimed!" : "Claim Your Gift"}
            </h1>
          </div>
          <div className="bg-white rounded-lg p-6 space-y-4">
            {isClaimed ? (
              <div className="text-center space-y-3">
                <p className="text-lg text-green-500 font-medium text-center">
                  {formatEther(gift.amount)} ETH has been claimed!
                </p>
                <p className="text-sm text-gray-500 text-center">
                  The funds have been sent to your wallet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go Home
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">
                    Claiming Amount
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {formatEther(gift.amount)} ETH
                  </div>
                </div>

                {(isClaiming || isConfirming) && (
                  <div className="bg-green-500/10 text-center border border-green-500 rounded-lg p-3 text-green-500 text-sm">
                    {isClaiming
                      ? "Waiting for transaction..."
                      : "Confirming transaction..."}
                  </div>
                )}

                <button
                  onClick={handleClaim}
                  disabled={isPending}
                  className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
