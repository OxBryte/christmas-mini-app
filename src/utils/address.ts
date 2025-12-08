/**
 * Truncate an Ethereum address to show first and last characters
 * @param address - The address to truncate
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Truncated address string, e.g., "0x1234...5678"
 */
export function truncateAddress(
  address: string | `0x${string}` | undefined | null,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) {
    return "";
  }

  const addr = address.toString();
  
  if (addr.length <= startLength + endLength) {
    return addr;
  }

  return `${addr.slice(0, startLength)}...${addr.slice(-endLength)}`;
}

