import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get total number of creators
 */
export function useTotalCreators() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalCreators",
  });

  return {
    totalCreators: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

