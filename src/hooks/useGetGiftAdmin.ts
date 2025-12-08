import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import type { GiftBatchData } from "./types";

/**
 * Get gift details with admin access (includes pinHash)
 * @param giftId - The gift ID
 */
export function useGetGiftAdmin(giftId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getGiftAdmin",
    args: giftId !== undefined ? [giftId] : undefined,
    query: {
      enabled: giftId !== undefined,
    },
  });

  return {
    gift: data as GiftBatchData | undefined,
    isLoading,
    error,
    refetch,
  };
}

