import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export interface GiftData {
  creator: `0x${string}`;
  amount: bigint;
  claimed: boolean;
  claimedBy: `0x${string}`;
  createdAt: bigint;
  claimedAt: bigint;
  message: string;
}

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

  return {
    gift: data as GiftData | undefined,
    isLoading,
    error,
    refetch,
  };
}
