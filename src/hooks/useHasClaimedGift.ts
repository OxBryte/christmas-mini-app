import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Check if user has claimed any gift
 * @param userAddress - The user's wallet address
 */
export function useHasClaimedGift(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "hasClaimedGift",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    hasClaimed: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  };
}

