export interface Gift {
  id: string;
  amount: string;
  pin: string;
  creator: string;
  createdAt: number;
  claimed: boolean;
  claimedBy?: string;
  claimedAt?: number;
}

const STORAGE_KEY = "christmas_gifts";

export function saveGift(gift: Gift): void {
  const gifts = getGifts();
  gifts[gift.id] = gift;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gifts));
}

export function getGift(id: string): Gift | null {
  const gifts = getGifts();
  console.log(gifts);
  console.log(id);
  return gifts[id] || null;
}

export function getGifts(): Record<string, Gift> {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function updateGift(id: string, updates: Partial<Gift>): void {
  const gift = getGift(id);
  if (gift) {
    saveGift({ ...gift, ...updates });
  }
}

export function generateGiftId(): string {
  return `gift_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

