import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get total value claimed
 */
export function useTotalValueClaimed() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalValueClaimed",
  });

  return {
    totalValueClaimed: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

