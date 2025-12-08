// Write hooks
export { useCancelGift } from "./useCancelGift";
export { useChangeAdmin } from "./useChangeAdmin";
export { useClaimGift } from "./useClaimGift";
export { useCreateGift } from "./useCreateGift";

// Read hooks
export { useAdmin } from "./useAdmin";
export { useGetContractBalance } from "./useGetContractBalance";
export { useGetGift, type GiftData } from "./useGetGift";
export { useGetGiftAdmin, type GiftAdminData } from "./useGetGiftAdmin";
export { useGetGiftsBatch, type GiftBatchData } from "./useGetGiftsBatch";
export { useGetPlatformStats, type PlatformStats } from "./useGetPlatformStats";
export { useGetUserClaims } from "./useGetUserClaims";
export { useGetUserGifts } from "./useGetUserGifts";
export { useGifts, type GiftMappingData } from "./useGifts";
export { useHasClaimedGift } from "./useHasClaimedGift";
export { useHasCreatedGift } from "./useHasCreatedGift";
export { useTotalClaimers } from "./useTotalClaimers";
export { useTotalCreators } from "./useTotalCreators";
export { useTotalGiftsClaimed } from "./useTotalGiftsClaimed";
export { useTotalGiftsCreated } from "./useTotalGiftsCreated";
export { useTotalValueClaimed } from "./useTotalValueClaimed";
export { useTotalValueLocked } from "./useTotalValueLocked";
export { useUserClaims } from "./useUserClaims";
export { useUserGifts } from "./useUserGifts";
