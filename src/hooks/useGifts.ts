import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export interface GiftMappingData {
  creator: `0x${string}`;
  amount: bigint;
  pinHash: `0x${string}`;
  claimed: boolean;
  claimedBy: `0x${string}`;
  createdAt: bigint;
  claimedAt: bigint;
  message: string;
}

export function useGifts(giftId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "gifts",
    args: giftId !== undefined ? [giftId] : undefined,
    query: {
      enabled: giftId !== undefined,
    },
  });

  return {
    gift: data as GiftMappingData | undefined,
    isLoading,
    error,
    refetch,
  };
}
