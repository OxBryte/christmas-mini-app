import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Get all gifts claimed by a user
 * @param userAddress - The user's wallet address
 */
export function useUserClaims(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getUserClaims",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    giftIds: data as bigint[] | undefined,
    isLoading,
    error,
    refetch,
  };
}
