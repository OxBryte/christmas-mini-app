import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get total number of claimers
 */
export function useTotalClaimers() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalClaimers",
  });

  return {
    totalClaimers: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

