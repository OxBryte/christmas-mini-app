import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import type { PlatformStats } from "./types";

/**
 * Get platform statistics (public - anyone can call)
 */
export function usePlatformStats() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getPlatformStats",
  });

  // Transform the tuple response into an object
  const stats = data as [
    bigint, // totalGiftsCreated
    bigint, // totalGiftsClaimed
    bigint, // totalValueLocked
    bigint, // totalValueClaimed
    bigint, // totalCreators
    bigint, // totalClaimers
    bigint // unclaimedGifts
  ] | undefined;

  return {
    stats: stats
      ? {
          totalGiftsCreated: stats[0],
          totalGiftsClaimed: stats[1],
          totalValueLocked: stats[2],
          totalValueClaimed: stats[3],
          totalCreators: stats[4],
          totalClaimers: stats[5],
          unclaimedGifts: stats[6],
        }
      : undefined,
    isLoading,
    error,
    refetch,
  };
}

export type { PlatformStats };

