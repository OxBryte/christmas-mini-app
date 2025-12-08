import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export interface GiftBatchData {
  creator: `0x${string}`;
  amount: bigint;
  pinHash: `0x${string}`;
  claimed: boolean;
  claimedBy: `0x${string}`;
  createdAt: bigint;
  claimedAt: bigint;
  message: string;
}

export function useGetGiftsBatch(startId: bigint | undefined, count: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getGiftsBatch",
    args: startId !== undefined && count !== undefined ? [startId, count] : undefined,
    query: {
      enabled: startId !== undefined && count !== undefined,
    },
  });

  return {
    gifts: data as GiftBatchData[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

