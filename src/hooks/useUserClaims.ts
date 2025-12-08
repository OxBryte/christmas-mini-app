import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useUserClaims(userAddress: `0x${string}` | undefined, index: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "userClaims",
    args: userAddress !== undefined && index !== undefined ? [userAddress, index] : undefined,
    query: {
      enabled: userAddress !== undefined && index !== undefined,
    },
  });

  return {
    claimId: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

