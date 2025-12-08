import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Change admin (Admin only)
 */
export function useChangeAdmin() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const changeAdmin = async (newAdmin: `0x${string}`) => {
    if (!newAdmin) {
      throw new Error("New admin address is required");
    }

    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "changeAdmin",
      args: [newAdmin],
    });
  };

  return {
    changeAdmin,
    isPending,
    error,
  };
}
