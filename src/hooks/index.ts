// Types
export type { GiftData, GiftBatchData, PlatformStats } from "./types";

// Utils
export { hashPin } from "./utils";

// Read hooks
export { useIsAdmin } from "./useIsAdmin";
export { useGetGift, type GiftData } from "./useGetGift";
export { useUserGifts } from "./useUserGifts";
export { useUserClaims } from "./useUserClaims";
export { usePlatformStats, type PlatformStats } from "./usePlatformStats";
export { useGetGiftsBatch, type GiftBatchData } from "./useGetGiftsBatch";
export { useContractBalance } from "./useContractBalance";
export { useUserGiftCount } from "./useUserGiftCount";
export { useEmergencyPaused } from "./useEmergencyPaused";

// Write hooks
export { useCreateGift } from "./useCreateGift";
export { useClaimGift } from "./useClaimGift";
export { useCancelGift } from "./useCancelGift";

// Admin write hooks
export { useToggleEmergencyPause } from "./useToggleEmergencyPause";
export { useEmergencyWithdraw } from "./useEmergencyWithdraw";
export { useChangeAdmin } from "./useChangeAdmin";
