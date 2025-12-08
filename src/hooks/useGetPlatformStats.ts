import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export interface PlatformStats {
  totalGiftsCreated: bigint;
  totalGiftsClaimed: bigint;
  totalValueLocked: bigint;
  totalValueClaimed: bigint;
  totalCreators: bigint;
  totalClaimers: bigint;
  unclaimedGifts: bigint;
}

export function useGetPlatformStats() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getPlatformStats",
  });

  return {
    stats: data as PlatformStats | undefined,
    isLoading,
    error,
    refetch,
  };
}
