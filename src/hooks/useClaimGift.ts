import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useClaimGift() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const claimGift = (giftId: bigint, pin: string) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "claimGift",
      args: [giftId, pin],
    });
  };

  return {
    claimGift,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

