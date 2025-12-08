import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useGetUserGifts(userAddress: `0x${string}` | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getUserGifts",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: userAddress !== undefined,
    },
  });

  return {
    gifts: data as bigint[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

