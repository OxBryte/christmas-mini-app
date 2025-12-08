import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Check if contract is paused
 */
export function useEmergencyPaused() {
  const { data, isLoading, error } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "emergencyPaused",
  });

  return {
    isPaused: data as boolean | undefined,
    isLoading,
    error,
  };
}

