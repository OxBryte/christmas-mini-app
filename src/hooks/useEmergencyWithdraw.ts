import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Emergency withdraw (Admin only)
 */
export function useEmergencyWithdraw() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const emergencyWithdraw = async (recipient: `0x${string}`) => {
    if (!recipient) {
      throw new Error("Recipient address is required");
    }

    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "emergencyWithdraw",
      args: [recipient],
    });
  };

  return {
    emergencyWithdraw,
    isPending,
    error,
  };
}

