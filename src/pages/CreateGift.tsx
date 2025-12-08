import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useCreateGift } from "../hooks/useCreateGift";
import { generateGiftCode } from "../utils/giftId";
import { saveGiftCodeMapping } from "../utils/giftCodeMapping";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function CreateGift() {
  const { address } = useAccount();
  const {
    createGift,
    isPending,
    isConfirming,
    isSuccess,
    giftId,
    error: hookError,
    reset,
  } = useCreateGift();
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [giftCode, setGiftCode] = useState("");
  const confettiTriggered = useRef(false);

  // Handle hook errors
  useEffect(() => {
    if (hookError) {
      const errorMessage = hookError.message || "Transaction failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [hookError]);

  // Handle local errors with toast
  useEffect(() => {
    if (error && !hookError) {
      toast.error(error);
    }
  }, [error, hookError]);

  // Generate code and save mapping when gift is created
  useEffect(() => {
    if (isSuccess && giftId && !giftCode) {
      // Generate a random 6-character code
      let code = generateGiftCode();
      // Ensure uniqueness (very unlikely but check anyway)
      const existingMappings = JSON.parse(
        localStorage.getItem("gift_code_mapping") || "{}"
      );
      while (existingMappings[code.toLowerCase()]) {
        code = generateGiftCode();
      }
      setGiftCode(code);
      // Save the mapping
      saveGiftCodeMapping(code, giftId);
    }
  }, [isSuccess, giftId, giftCode]);

  // Trigger confetti when gift is successfully created
  useEffect(() => {
    if (isSuccess && giftId && giftCode && !confettiTriggered.current) {
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

      // Reset confetti trigger when component unmounts or resets
      return () => {
        clearInterval(interval);
      };
    }
  }, [isSuccess, giftId, giftCode]);

  const giftUrl = giftCode ? `${window.location.origin}/claim/${giftCode}` : "";

  const handleCopy = () => {
    if (giftUrl) {
      navigator.clipboard.writeText(giftUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (giftUrl && navigator.share) {
      try {
        await navigator.share({
          title: "Christmas Gift",
          text: "You've been gifted! Claim your gift here:",
          url: giftUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback to copy if share is not available
      handleCopy();
    }
  };

  const handleCreate = async () => {
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      const errorMsg = "Please enter a valid amount";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!pin || pin.length < 4) {
      const errorMsg = "PIN must be at least 4 characters";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Message is optional, but we'll use empty string if not provided

    if (!address) {
      const errorMsg = "Wallet not connected";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      await createGift(pin, message.trim() || "", amount);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create gift";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };
  // Show success view when gift is created
  if (isSuccess && giftId && giftCode) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">
              Gift Created Successfully!
            </h1>
            <p className="text-gray-400">Share this link with your loved one</p>
          </div>

          <div className="bg-[#f2f2f2]/50 rounded-lg p-6 border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Gift Code
              </label>
              <div className="px-4 py-3 bg-white border-2 border-blue-500 rounded-lg text-black font-mono text-2xl text-center tracking-wider mb-2">
                {giftCode}
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">
                Share this 6-character code with the recipient
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Claim Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={giftUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-black text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg transition-colors font-medium"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 cursor-pointer text-white rounded-lg transition-colors font-medium"
              >
                {typeof navigator !== "undefined" && "share" in navigator
                  ? "Share"
                  : "Copy Link"}
              </button>
              <button
                onClick={() => {
                  // Reset form and hook state
                  setAmount("");
                  setPin("");
                  setMessage("");
                  setError("");
                  setCopied(false);
                  setGiftCode("");
                  confettiTriggered.current = false;
                  reset();
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 cursor-pointer text-white rounded-lg transition-colors font-medium"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full h-full gap-3 p-4">
      <div className="w-full flex flex-col items-start gap-4">
        <h1 className="text-3xl font-semibold">Create a Gift 🎁</h1>
        <div className="w-full flex flex-col gap-3">
          <div className="">
            <label className="block text-xs text-gray-500 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="">
            <label className="block text-xs text-gray-500 mb-2">PIN</label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter a unique PIN"
              maxLength={20}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <p className="text-xs italic font-light text-gray-400 mt-1">
              The recipient will need this PIN to claim
            </p>
          </div>
          <div className="">
            <label className="block text-xs text-gray-500 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message for the recipient..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
            />
            <p className="text-xs italic font-light text-gray-400">
              {message.length || 0}/500 characters
            </p>
          </div>

          <button
            onClick={handleCreate}
            disabled={isPending || isConfirming || isSuccess}
            className="w-full px-6 py-3 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 cursor-pointer text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming || isSuccess
              ? "Creating Gift..."
              : "Create Gift"}
          </button>
        </div>
      </div>
    </div>
  );
}
