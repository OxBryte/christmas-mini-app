import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";
import { useIsAdmin } from "./useIsAdmin";
import type { GiftBatchData } from "./types";

/**
 * Get batch of gifts (Admin only)
 * @param startId - Starting gift ID
 * @param count - Number of gifts to fetch
 */
export function useGetGiftsBatch(
  startId: bigint | undefined,
  count: bigint | undefined
) {
  const { isAdmin } = useIsAdmin();

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getGiftsBatch",
    args:
      startId !== undefined && count !== undefined
        ? [startId, count]
        : undefined,
    query: {
      enabled: startId !== undefined && count !== undefined && isAdmin,
    },
  });

  return {
    gifts: data as GiftBatchData[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

export type { GiftBatchData };
