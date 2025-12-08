import { keccak256, toBytes } from "viem";

/**
 * Hash a PIN for secure storage/comparison
 * @param pin - The PIN string to hash
 * @returns The keccak256 hash of the PIN
 */
export function hashPin(pin: string): `0x${string}` {
  return keccak256(toBytes(pin));
}

