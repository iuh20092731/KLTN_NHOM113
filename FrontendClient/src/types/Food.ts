import { z } from "zod";

export const TimeSchema = z.object({
  hour: z.number(),
  minute: z.number(),
  second: z.number(),
  nano: z.number()
});

export const MediaSchema = z.object({
  id: z.number(),
  name: z.string(),
  content: z.string(),
  url: z.string(),
  type: z.string(),
  advertisementId: z.number()
});

export const FoodItemSchema = z.object({
  advertisementId: z.number(),
  mainAdvertisementName: z.string(),
  serviceId: z.number(),
  serviceName: z.string(),
  serviceNameNoDiacritics: z.string(),
  advertiserId: z.string(),
  adminId: z.string(),
  adStartDate: z.string().datetime(),
  adEndDate: z.string().datetime(),
  clicks: z.number(),
  likes: z.number(),
  views: z.number(),
  saved: z.number(),
  shared: z.number(),
  distance: z.number(),
  adStatus: z.string(),
  reviewNotes: z.string(),
  description: z.string(),
  detailedDescription: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  priceRangeLow: z.number(),
  priceRangeHigh: z.number(),
  openingHourStart: TimeSchema,
  openingHourEnd: TimeSchema,
  googleMapLink: z.string(),
  websiteLink: z.string(),
  deliveryAvailable: z.boolean(),
  averageRating: z.number(),
  reviewCount: z.number(),
  categoryName: z.string(),
  categoryNameNoDiacritics: z.string(),
  facebookLink: z.string().nullable(),
  zaloLink: z.string().nullable(),
  mediaList: z.array(MediaSchema)
});

export type FoodItem = z.infer<typeof FoodItemSchema>;