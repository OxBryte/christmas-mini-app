import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get total number of gifts created
 */
export function useTotalGiftsCreated() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalGiftsCreated",
  });

  return {
    totalGiftsCreated: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

