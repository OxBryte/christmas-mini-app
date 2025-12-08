import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get user gift count
 */
export function useUserGiftCount(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getUserGiftCount",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    count: data as bigint | undefined,
    isLoading,
    error,
  };
}

