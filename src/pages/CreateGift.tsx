import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useCreateGift } from "../hooks/useCreateGift";

export default function CreateGift() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const {
    createGift,
    isPending,
    isConfirming,
    isSuccess,
    giftId,
    error: hookError,
  } = useCreateGift();
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Navigate to gift details when gift is created
  useEffect(() => {
    if (isSuccess && giftId) {
      navigate(`/gift/${giftId.toString()}`);
    }
  }, [isSuccess, giftId, navigate]);

  // Handle hook errors
  useEffect(() => {
    if (hookError) {
      setError(hookError.message || "Transaction failed");
    }
  }, [hookError]);

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

          {isSuccess && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-green-400 text-sm">
              Gift created successfully! Redirecting...
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
