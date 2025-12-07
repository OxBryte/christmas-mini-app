import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGift } from "../utils/storage";
import { formatEther } from "viem";

export default function GiftDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gift, setGift] = useState(getGift(id || ""));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const foundGift = getGift(id);
      setGift(foundGift);
    }
  }, [id]);

  if (!gift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Gift Not Found</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/claim/${gift.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">🎁 Gift Created!</h1>
        <p className="text-gray-400 text-center mb-8">Share this link with your loved one</p>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gift Amount
            </label>
            <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-lg">
              {formatEther(BigInt(gift.amount))} ETH
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Claim Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {copied ? "✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700 space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Create Another Gift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

