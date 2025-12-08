import { useReadContract } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

export function useGetContractBalance() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "getContractBalance",
  });

  return {
    balance: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

