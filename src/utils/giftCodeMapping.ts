/**
 * Store and retrieve gift code to giftId mappings
 */

const MAPPING_KEY = "gift_code_mapping";

interface CodeMapping {
  [code: string]: string; // code -> giftId (as string for localStorage)
}

export function saveGiftCodeMapping(code: string, giftId: bigint): void {
  const mappings = getGiftCodeMappings();
  mappings[code.toLowerCase()] = giftId.toString();
  localStorage.setItem(MAPPING_KEY, JSON.stringify(mappings));
}

export function getGiftIdFromCode(code: string): bigint | null {
  const mappings = getGiftCodeMappings();
  const giftIdStr = mappings[code.toLowerCase()];
  
  if (!giftIdStr) {
    return null;
  }

  try {
    return BigInt(giftIdStr);
  } catch {
    return null;
  }
}

export function getGiftCodeMappings(): CodeMapping {
  const stored = localStorage.getItem(MAPPING_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function getCodeFromGiftId(giftId: bigint): string | null {
  const mappings = getGiftCodeMappings();
  const giftIdStr = giftId.toString();
  
  for (const [code, id] of Object.entries(mappings)) {
    if (id === giftIdStr) {
      return code;
    }
  }
  
  return null;
}

