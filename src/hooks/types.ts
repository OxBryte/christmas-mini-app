export interface GiftData {
  creator: `0x${string}`;
  amount: bigint;
  claimed: boolean;
  claimedBy: `0x${string}`;
  createdAt: bigint;
  claimedAt: bigint;
  message: string;
}

export interface GiftBatchData extends GiftData {
  pinHash: `0x${string}`;
}

export interface PlatformStats {
  totalGiftsCreated: bigint;
  totalGiftsClaimed: bigint;
  totalValueLocked: bigint;
  totalValueClaimed: bigint;
  totalCreators: bigint;
  totalClaimers: bigint;
  unclaimedGifts: bigint;
}

