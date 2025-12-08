import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useAdmin() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "admin",
  });

  return {
    admin: data as `0x${string}` | undefined,
    isLoading,
    error,
    refetch,
  };
}

