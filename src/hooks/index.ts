// Utils
export { hashPin } from "./utils";

// Read hooks
export { useIsAdmin } from "./useIsAdmin";
export { useGetGift, type GiftData } from "./useGetGift";
export { useGetGiftAdmin } from "./useGetGiftAdmin";
export { useUserGifts } from "./useUserGifts";
export { useUserClaims } from "./useUserClaims";
export { useUserGiftCount } from "./useUserGiftCount";
export { useUserClaimCount } from "./useUserClaimCount";
export { usePlatformStats, type PlatformStats } from "./usePlatformStats";
export { useGetGiftsBatch, type GiftBatchData } from "./useGetGiftsBatch";
export { useContractBalance } from "./useContractBalance";
export { useEmergencyPaused } from "./useEmergencyPaused";
export { useGifts } from "./useGifts";
export { useHasClaimedGift } from "./useHasClaimedGift";
export { useHasCreatedGift } from "./useHasCreatedGift";
export { useTotalClaimers } from "./useTotalClaimers";
export { useTotalCreators } from "./useTotalCreators";
export { useTotalGiftsClaimed } from "./useTotalGiftsClaimed";
export { useTotalGiftsCreated } from "./useTotalGiftsCreated";
export { useTotalValueClaimed } from "./useTotalValueClaimed";
export { useTotalValueLocked } from "./useTotalValueLocked";

// Write hooks
export { useCreateGift } from "./useCreateGift";
export { useClaimGift } from "./useClaimGift";
export { useCancelGift } from "./useCancelGift";

// Admin write hooks
export { useToggleEmergencyPause } from "./useToggleEmergencyPause";
export { useEmergencyWithdraw } from "./useEmergencyWithdraw";
export { useChangeAdmin } from "./useChangeAdmin";
