import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import { decodeEventLog } from "viem";
import { useEffect, useState } from "react";
import { hashPin } from "./utils";

/**
 * Create a new gift
 * Usage:
 * const { createGift, isPending, isSuccess, giftId } = useCreateGift();
 * await createGift(pin, message, amountInEth);
 */
export function useCreateGift() {
  const { writeContractAsync, isPending, error } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [giftId, setGiftId] = useState<bigint | null>(null);

  useEffect(() => {
    if (receipt) {
      // Parse the GiftCreated event to get the giftId
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: contractABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "GiftCreated") {
            // giftId is the first indexed parameter, so it's in topics[1]
            if (log.topics[1]) {
              const id = BigInt(log.topics[1]);
              setGiftId(id);
              break;
            }
          }
        } catch {
          continue;
        }
      }
    }
  }, [receipt]);

  const createGift = async (
    pin: string,
    message: string,
    amountInEth: string
  ) => {
    if (!pin || pin.length < 4) {
      throw new Error("PIN must be at least 4 characters");
    }

    setGiftId(null);
    const pinHash = hashPin(pin);

    const txHash = await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: "createGift",
      args: [pinHash, message],
      value: BigInt(parseFloat(amountInEth) * 1e18), // Convert ETH to Wei
    });

    setHash(txHash);
    return txHash;
  };

  const reset = () => {
    setHash(undefined);
    setGiftId(null);
  };

  return {
    createGift,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    giftId,
    error,
    reset,
  };
}
