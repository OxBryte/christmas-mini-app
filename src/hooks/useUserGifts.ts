import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useUserGifts(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "userGifts",
    args: userAddress !== undefined ? [userAddress] : undefined, // Only address!
    query: {
      enabled: userAddress !== undefined,
    },
  });

  return {
    giftIds: data as bigint[] | undefined, // Array of all gift IDs
    isLoading,
    error,
    refetch,
  };
}
