import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import type { GiftData } from "./types";

/**
 * Get details of a specific gift
 * @param giftId - The gift ID
 */
export function useGetGift(giftId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getGift",
    args: giftId !== undefined ? [giftId] : undefined,
    query: {
      enabled: giftId !== undefined,
    },
  });

  // Transform the tuple response into an object
  const gift = data as [
    `0x${string}`, // creator
    bigint, // amount
    boolean, // claimed
    `0x${string}`, // claimedBy
    bigint, // createdAt
    bigint, // claimedAt
    string // message
  ] | undefined;

  return {
    gift: gift
      ? {
          creator: gift[0],
          amount: gift[1],
          claimed: gift[2],
          claimedBy: gift[3],
          createdAt: gift[4],
          claimedAt: gift[5],
          message: gift[6],
        }
      : undefined,
    isLoading,
    error,
    refetch,
  };
}

export type { GiftData };
