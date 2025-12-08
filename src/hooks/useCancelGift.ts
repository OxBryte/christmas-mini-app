import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useCancelGift() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancelGift = (giftId: bigint) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "cancelGift",
      args: [giftId],
    });
  };

  return {
    cancelGift,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
