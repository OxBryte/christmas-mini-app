import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import { parseEther, decodeEventLog } from "viem";
import { useEffect, useState } from "react";

export function useCreateGift() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const [giftId, setGiftId] = useState<bigint | null>(null);

  useEffect(() => {
    if (receipt) {
      // Parse the GiftCreated event to get the giftId
      // The giftId is in the first indexed topic (topics[1])
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: contractABI,
            data: log.data,
            topics: log.topics,
          });
          
          if (decoded.eventName === "GiftCreated") {
            // For indexed events, args might be an array or object
            // giftId is the first indexed parameter, so it's in topics[1]
            if (log.topics[1]) {
              const id = BigInt(log.topics[1]);
              setGiftId(id);
              break;
            }
          }
        } catch {
          // Not the event we're looking for, continue
          continue;
        }
      }
    }
  }, [receipt]);

  const createGift = (pin: string, message: string, amount: string) => {
    setGiftId(null);
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
    giftId,
    error,
  };
}
