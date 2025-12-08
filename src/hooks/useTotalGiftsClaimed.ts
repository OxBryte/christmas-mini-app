import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get total number of gifts claimed
 */
export function useTotalGiftsClaimed() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalGiftsClaimed",
  });

  return {
    totalGiftsClaimed: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

