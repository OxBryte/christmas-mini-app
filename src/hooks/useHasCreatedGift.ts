import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Check if user has created any gift
 * @param userAddress - The user's wallet address
 */
export function useHasCreatedGift(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "hasCreatedGift",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    hasCreated: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  };
}

