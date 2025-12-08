import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import { hashPin } from "./utils";

/**
 * Claim a gift
 * Usage:
 * const { claimGift, isPending } = useClaimGift();
 * await claimGift(giftId, pin);
 */
export function useClaimGift() {
  const { writeContractAsync, isPending, error } = useWriteContract();

  const claimGift = async (giftId: bigint, pin: string) => {
    if (!pin) {
      throw new Error("PIN is required");
    }

    const pinHash = hashPin(pin);

    return await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "claimGift",
      args: [giftId, pinHash],
    });
  };

  return {
    claimGift,
    isPending,
    error,
  };
}
