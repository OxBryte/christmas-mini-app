import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useChangeAdmin() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const changeAdmin = (newAdmin: `0x${string}`) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "changeAdmin",
      args: [newAdmin],
    });
  };

  return {
    changeAdmin,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
