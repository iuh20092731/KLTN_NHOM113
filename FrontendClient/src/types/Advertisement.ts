import { z } from "zod";

// Media schema
export const MediaSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  content: z.string().nullable(),
  url: z.string().nullable(),
  type: z.string().nullable(),
  advertisementId: z.number().nullable(),
});

export const MediaSchemaV2 = z.object({
  id: z.number(),
  name: z.string(),
  content: z.string().nullable(),
  url: z.string().url(),
  type: z.enum(["BANNER", "IMAGE"]),
  status: z.string().nullable(),
  advertisementId: z.number().nullable(),
});

export const AdvertisementSchemaV2 = z.object({
  advertisementId: z.number(),
  mainAdvertisementName: z.string(),
  serviceId: z.number(),
  advertiserId: z.string(),
  adminId: z.string().nullable(),
  adStartDate: z.string().datetime(),
  adEndDate: z.string().datetime(),
  clicks: z.number(),
  adStatus: z.string(),
  reviewNotes: z.string().nullable(),
  description: z.string().nullable(),
  detailedDescription: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  priceRangeLow: z.number(),
  priceRangeHigh: z.number(),
  openingHourStart: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  openingHourEnd: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  googleMapLink: z.string().url(),
  websiteLink: z.string().nullable(),
  zaloLink: z.string().nullable(),
  facebookLink: z.string().nullable(),
  deliveryAvailable: z.boolean(),
  mediaList: z.array(MediaSchema),
  likes: z.number().nullable()
});

// Advertisement schema
export const AdvertisementSchema = z.object({
  advertisementId: z.number(),
  mainAdvertisementName: z.string().nullable(),
  serviceId: z.number().nullable(),
  description: z.string().nullable(),
  detailedDescription: z.string().nullable(),
  address: z.string().nullable(),
  deliveryAvailable: z.boolean().nullable(),
  phoneNumber: z.string().nullable(),
  views: z.number().nullable(),
  likes: z.number().nullable(),
  saves: z.number().nullable(),
  shares: z.number().nullable(),
  distance: z.number().nullable(),
  averageRating: z.number().nullable(),
  reviewCount: z.number().nullable(),
  clicks: z.number().nullable(),
  categoryName: z.string().nullable(),
  categoryNameNoDiacritics: z.string().nullable(),
  mediaList: z.array(MediaSchema),
  zaloLink:z.string().nullable()
  // clickCount: z.number().nullable(),
});

// API Response schema
export const ApiResponseSchema = z.object({
  code: z.number(),
  result: z.array(AdvertisementSchema),
});

export const AdvertisementFullSchema = z.object({
  advertisementId: z.number(),
  mainAdvertisementName: z.string(),
  serviceId: z.number(),
  categoryNameNoDiacritics: z.string(),
  serviceName: z.string(),
  serviceNameNoDiacritics: z.string(),
  advertiserId: z.string(),
  adminId: z.string(),
  adStartDate: z.string(),
  adEndDate: z.string(),
  clicks: z.number(),
  likes: z.number(),
  views: z.number(),
  saved: z.number(),
  shared: z.number(),
  address: z.string().nullable(),
  distance: z.number(),
  adStatus: z.string(),
  reviewNotes: z.string().nullable(),
  description: z.string().nullable(),
  detailedDescription: z.string().nullable(),
  phoneNumber: z.string(),
  priceRangeLow: z.number(),
  priceRangeHigh: z.number(),
  googleMapLink: z.string().nullable(),
  websiteLink: z.string().nullable(),
  zaloLink: z.string().nullable(),
  facebookLink: z.string().nullable(),
  deliveryAvailable: z.boolean(),
  averageRating: z.number(),
  reviewCount: z.number(),
  mediaList: z.array(MediaSchema)
});

// Inferred types
export type Media = z.infer<typeof MediaSchema>;
export type Advertisement = z.infer<typeof AdvertisementSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type AdvertisementFull = z.infer<typeof AdvertisementFullSchema>;
export type AdvertisementV2 = z.infer<typeof AdvertisementSchemaV2>;
