import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useTotalValueLocked() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "totalValueLocked",
  });

  return {
    totalValueLocked: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}
