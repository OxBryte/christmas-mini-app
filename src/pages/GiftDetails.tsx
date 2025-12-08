import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetGift } from "../hooks/useGetGift";
import { formatEther } from "viem";

export default function GiftDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [giftId, setGiftId] = useState<bigint | undefined>(
    id ? BigInt(id) : undefined
  );

  const { gift, isLoading, error } = useGetGift(giftId);

  useEffect(() => {
    if (id) {
      try {
        setGiftId(BigInt(id));
      } catch {
        // Invalid ID, giftId remains undefined
      }
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-2xl font-bold">Loading gift...</div>
        <p className="text-gray-400">Please wait</p>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Gift Not Found</h1>
        <p className="text-gray-400">The gift you're looking for doesn't exist</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/claim/${giftId?.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: "Christmas Gift",
          text: "You've been gifted! Claim your gift here:",
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">🎁 Gift Details</h1>
        <p className="text-gray-400 text-center mb-8">Share this link with your loved one</p>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gift Amount
            </label>
            <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-lg">
              {formatEther(gift.amount)} ETH
            </div>
          </div>

          {gift.message && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white">
                {gift.message}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${gift.claimed ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="text-white">
                  {gift.claimed ? "Claimed" : "Unclaimed"}
                </span>
              </div>
              {gift.claimed && gift.claimedBy && (
                <p className="text-xs text-gray-400 mt-1">
                  Claimed by: {gift.claimedBy.slice(0, 6)}...{gift.claimedBy.slice(-4)}
                </p>
              )}
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

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={handleShare}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              {typeof navigator !== "undefined" && "share" in navigator ? "Share" : "Copy Link"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
