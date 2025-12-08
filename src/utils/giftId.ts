/**
 * Convert a bigint gift ID to a 6-character alphanumeric code
 * Uses base36 encoding (0-9, a-z) and pads to 6 characters
 */
export function encodeGiftId(giftId: bigint): string {
  // Convert to base36 (0-9, a-z)
  let encoded = giftId.toString(36);
  
  // Pad with leading zeros to make it 6 characters
  // If longer than 6, take last 6 characters
  if (encoded.length < 6) {
    encoded = encoded.padStart(6, "0");
  } else if (encoded.length > 6) {
    encoded = encoded.slice(-6);
  }
  
  return encoded;
}

/**
 * Convert a 6-character alphanumeric code back to bigint gift ID
 */
export function decodeGiftId(encoded: string): bigint | null {
  try {
    // Remove any whitespace and convert to lowercase
    const cleaned = encoded.trim().toLowerCase();
    
    // Validate it's alphanumeric and 6 characters
    if (!/^[0-9a-z]{6}$/.test(cleaned)) {
      return null;
    }
    
    // Convert from base36 to bigint
    return BigInt(parseInt(cleaned, 36));
  } catch {
    return null;
  }
}

/**
 * Validate if a string is a valid gift ID code
 */
export function isValidGiftIdCode(code: string): boolean {
  return /^[0-9a-z]{6}$/i.test(code.trim());
}

