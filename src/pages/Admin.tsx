import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { toast } from "sonner";
import {
  useIsAdmin,
  usePlatformStats,
  useContractBalance,
  useEmergencyPaused,
  useGetGiftsBatch,
  useToggleEmergencyPause,
  useEmergencyWithdraw,
  useChangeAdmin,
  useGetGiftAdmin,
} from "../hooks";
import { truncateAddress } from "../utils/address";

export default function Admin() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { isAdmin, adminAddress } = useIsAdmin();
  const { stats, isLoading: isLoadingStats } = usePlatformStats();
  const { balance, isLoading: isLoadingBalance } = useContractBalance();
  const { isPaused, isLoading: isLoadingPaused } = useEmergencyPaused();

  // State for batch gifts
  const [startId, setStartId] = useState("");
  const [count, setCount] = useState("10");
  const [batchGifts, setBatchGifts] = useState<any[]>([]);

  // State for emergency withdraw
  const [withdrawRecipient, setWithdrawRecipient] = useState("");
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [giftIdToView, setGiftIdToView] = useState("");

  // Admin action hooks
  const {
    togglePause,
    isPending: isTogglingPause,
    error: pauseError,
  } = useToggleEmergencyPause();
  const {
    emergencyWithdraw,
    isPending: isWithdrawing,
    error: withdrawError,
  } = useEmergencyWithdraw();
  const {
    changeAdmin,
    isPending: isChangingAdmin,
    error: changeAdminError,
  } = useChangeAdmin();

  // Get gifts batch
  const {
    gifts: batchGiftsData,
    isLoading: isLoadingBatch,
    refetch: refetchBatch,
  } = useGetGiftsBatch(
    startId ? BigInt(startId) : undefined,
    count ? BigInt(count) : undefined
  );

  // Get specific gift with admin access
  const {
    gift: adminGift,
    isLoading: isLoadingGift,
    refetch: refetchGift,
  } = useGetGiftAdmin(giftIdToView ? BigInt(giftIdToView) : undefined);

  // Check admin access
  useEffect(() => {
    if (isConnected) {
      if (isAdmin === false) {
        toast.error("Access denied. Admin only.");
        navigate("/");
      }
    } else if (!isConnected) {
      toast.error("Please connect your wallet");
      navigate("/");
    }
  }, [isAdmin, isConnected, navigate]);

  // Handle errors
  useEffect(() => {
    if (pauseError) {
      toast.error(pauseError.message || "Failed to toggle pause");
    }
    if (withdrawError) {
      toast.error(withdrawError.message || "Failed to withdraw");
    }
    if (changeAdminError) {
      toast.error(changeAdminError.message || "Failed to change admin");
    }
  }, [pauseError, withdrawError, changeAdminError]);

  // Update batch gifts when data changes
  useEffect(() => {
    if (batchGiftsData) {
      setBatchGifts(batchGiftsData);
    }
  }, [batchGiftsData]);

  const handleTogglePause = async () => {
    try {
      await togglePause();
      toast.success("Emergency pause toggled successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to toggle pause"
      );
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!withdrawRecipient) {
      toast.error("Please enter recipient address");
      return;
    }

    if (
      !withdrawRecipient.startsWith("0x") ||
      withdrawRecipient.length !== 42
    ) {
      toast.error("Invalid address format");
      return;
    }

    try {
      await emergencyWithdraw(withdrawRecipient as `0x${string}`);
      toast.success("Emergency withdraw initiated");
      setWithdrawRecipient("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to withdraw");
    }
  };

  const handleChangeAdmin = async () => {
    if (!newAdminAddress) {
      toast.error("Please enter new admin address");
      return;
    }

    if (!newAdminAddress.startsWith("0x") || newAdminAddress.length !== 42) {
      toast.error("Invalid address format");
      return;
    }

    try {
      await changeAdmin(newAdminAddress as `0x${string}`);
      toast.success("Admin change initiated");
      setNewAdminAddress("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change admin"
      );
    }
  };

  const handleFetchBatch = () => {
    if (!startId || !count) {
      toast.error("Please enter start ID and count");
      return;
    }
    refetchBatch();
  };

  const handleViewGift = () => {
    if (!giftIdToView) {
      toast.error("Please enter gift ID");
      return;
    }
    refetchGift();
  };

  if (!isConnected || isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-400">Admin access required</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
        >
          Home
        </button>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-500">Current Admin:</span>
            <span className="ml-2 font-mono">
              {adminAddress ? truncateAddress(adminAddress) : "Loading..."}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Your Address:</span>
            <span className="ml-2 font-mono">
              {address ? truncateAddress(address) : "Not connected"}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <span
              className={`ml-2 font-semibold ${isAdmin ? "text-green-500" : "text-red-500"}`}
            >
              {isAdmin ? "✓ Admin" : "✗ Not Admin"}
            </span>
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Platform Statistics</h2>
        {isLoadingStats ? (
          <div className="text-gray-400">Loading statistics...</div>
        ) : stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Gifts Created</div>
              <div className="text-2xl font-bold">
                {stats.totalGiftsCreated.toString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Gifts Claimed</div>
              <div className="text-2xl font-bold">
                {stats.totalGiftsClaimed.toString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Creators</div>
              <div className="text-2xl font-bold">
                {stats.totalCreators.toString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Claimers</div>
              <div className="text-2xl font-bold">
                {stats.totalClaimers.toString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Value Locked</div>
              <div className="text-2xl font-bold">
                {formatEther(stats.totalValueLocked)} ETH
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Value Claimed</div>
              <div className="text-2xl font-bold">
                {formatEther(stats.totalValueClaimed)} ETH
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Unclaimed Gifts</div>
              <div className="text-2xl font-bold">
                {stats.unclaimedGifts.toString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500">Failed to load statistics</div>
        )}
      </div>

      {/* Contract Balance & Emergency Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Contract Balance</h2>
          {isLoadingBalance ? (
            <div className="text-gray-400">Loading...</div>
          ) : balance !== undefined ? (
            <div className="text-3xl font-bold">{formatEther(balance)} ETH</div>
          ) : (
            <div className="text-red-500">Failed to load balance</div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Emergency Status</h2>
          {isLoadingPaused ? (
            <div className="text-gray-400">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span
                  className={`font-semibold ${isPaused ? "text-red-500" : "text-green-500"}`}
                >
                  {isPaused ? "⛔ Paused" : "✓ Active"}
                </span>
              </div>
              <button
                onClick={handleTogglePause}
                disabled={isTogglingPause}
                className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg disabled:opacity-50"
              >
                {isTogglingPause
                  ? "Processing..."
                  : isPaused
                    ? "Unpause"
                    : "Pause"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Withdraw */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Emergency Withdraw</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={withdrawRecipient}
                onChange={(e) => setWithdrawRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleEmergencyWithdraw}
              disabled={isWithdrawing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
            >
              {isWithdrawing ? "Processing..." : "Emergency Withdraw"}
            </button>
          </div>
        </div>

        {/* Change Admin */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Change Admin</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Admin Address
              </label>
              <input
                type="text"
                value={newAdminAddress}
                onChange={(e) => setNewAdminAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleChangeAdmin}
              disabled={isChangingAdmin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {isChangingAdmin ? "Processing..." : "Change Admin"}
            </button>
          </div>
        </div>

        {/* Get Gifts Batch */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Get Gifts Batch</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start ID
                </label>
                <input
                  type="number"
                  value={startId}
                  onChange={(e) => setStartId(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={handleFetchBatch}
              disabled={isLoadingBatch}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
            >
              {isLoadingBatch ? "Loading..." : "Fetch Batch"}
            </button>

            {batchGifts.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Gifts ({batchGifts.length})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {batchGifts.map((gift, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div>Creator: {truncateAddress(gift.creator)}</div>
                      <div>Amount: {formatEther(gift.amount)} ETH</div>
                      <div>Claimed: {gift.claimed ? "Yes" : "No"}</div>
                      {gift.message && <div>Message: {gift.message}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Get Gift Admin */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            View Gift (Admin Access)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift ID
              </label>
              <input
                type="number"
                value={giftIdToView}
                onChange={(e) => setGiftIdToView(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleViewGift}
              disabled={isLoadingGift}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
            >
              {isLoadingGift ? "Loading..." : "View Gift"}
            </button>

            {adminGift && (
              <>
                <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="font-semibold">Creator:</span>{" "}
                    {truncateAddress(adminGift.creator)}
                  </div>
                  <div>
                    <span className="font-semibold">Amount:</span>{" "}
                    {formatEther(adminGift.amount)} ETH
                  </div>
                  <div>
                    <span className="font-semibold">Claimed:</span>{" "}
                    {adminGift.claimed ? "Yes" : "No"}
                  </div>
                  {adminGift.claimedBy && (
                    <div>
                      <span className="font-semibold">Claimed By:</span>{" "}
                      {truncateAddress(adminGift.claimedBy)}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">PIN Hash:</span>{" "}
                    <span className="font-mono text-xs">
                      {adminGift.pinHash}
                    </span>
                  </div>
                  {adminGift.message && (
                    <div>
                      <span className="font-semibold">Message:</span>{" "}
                      {adminGift.message}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
