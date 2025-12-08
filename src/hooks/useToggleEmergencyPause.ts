import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Toggle emergency pause (Admin only)
 */
export function useToggleEmergencyPause() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const togglePause = async () => {
    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "toggleEmergencyPause",
    });
  };

  return {
    togglePause,
    isPending,
    error,
  };
}

