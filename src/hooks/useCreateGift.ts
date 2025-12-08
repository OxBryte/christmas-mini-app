import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import { parseEther } from "viem";

export function useCreateGift() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createGift = (pin: string, message: string, amount: string) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "createGift",
      args: [pin, message],
      value: parseEther(amount),
    });
  };

  return {
    createGift,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

