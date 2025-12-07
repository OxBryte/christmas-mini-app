import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { generateGiftId, saveGift } from "../utils/storage";
import { parseEther } from "viem";

export default function CreateGift() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

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

    if (!address) {
      setError("Wallet not connected");
      return;
    }

    try {
      const newGiftId = generateGiftId();
      
      const gift = {
        id: newGiftId,
        amount: parseEther(amount).toString(),
        pin,
        creator: address,
        createdAt: Date.now(),
        claimed: false,
      };

      saveGift(gift);
      navigate(`/gift/${newGiftId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create gift");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Create a Gift 🎁</h1>
        <p className="text-gray-400 text-center mb-8">Set the amount and PIN for your gift</p>

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
            <p className="text-xs text-gray-500 mt-1">The recipient will need this PIN to claim</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreate}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Create Gift
          </button>
        </div>
      </div>
    </div>
  );
}

