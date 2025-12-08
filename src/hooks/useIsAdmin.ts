import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractABI } from "../constant/contractABI";

/**
 * Check if connected user is admin
 */
export function useIsAdmin() {
  const { address } = useAccount();

  const { data: adminAddress } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "admin",
  });

  const { data: isAdminResult } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "isAdmin",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    isAdmin: isAdminResult as boolean | undefined,
    adminAddress: adminAddress as `0x${string}` | undefined,
  };
}

