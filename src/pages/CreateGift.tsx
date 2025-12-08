import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useCreateGift } from "../hooks/useCreateGift";
import { encodeGiftId } from "../utils/giftId";

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

  // Handle hook errors
  useEffect(() => {
    if (hookError) {
      setError(hookError.message || "Transaction failed");
    }
  }, [hookError]);
  const giftCode = giftId ? encodeGiftId(giftId) : "";
  const giftUrl = giftCode
    ? `${window.location.origin}/claim/${giftCode}`
    : "";

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
      setError("Please enter a valid amount");
      return;
    }

    if (!pin || pin.length < 4) {
      setError("PIN must be at least 4 characters");
      return;
    }

    // Message is optional, but we'll use empty string if not provided

    if (!address) {
      setError("Wallet not connected");
      return;
    }

    try {
      await createGift(pin, message.trim() || "", amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create gift");
    }
  };

  // Show success view when gift is created
  if (isSuccess && giftId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">
              Gift Created Successfully!
            </h1>
            <p className="text-gray-400">Share this link with your loved one</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gift Code
              </label>
              <div className="px-4 py-3 bg-gray-900 border-2 border-blue-500 rounded-lg text-white font-mono text-2xl text-center tracking-wider mb-2">
                {giftCode}
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">
                Share this 6-character code with the recipient
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Claim Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={giftUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
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
                  reset();
                }}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Create a Gift 🎁
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Set the amount and PIN for your gift
        </p>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Claim PIN
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter a unique PIN"
              maxLength={20}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              The recipient will need this PIN to claim
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message for the recipient..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {(isPending || isConfirming) && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-blue-400 text-sm">
              {isPending
                ? "Waiting for transaction..."
                : "Confirming transaction..."}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={isPending || isConfirming || isSuccess}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Creating..."
              : isConfirming
                ? "Confirming..."
                : isSuccess
                  ? "Created!"
                  : "Create Gift"}
          </button>
        </div>
      </div>
    </div>
  );
}
