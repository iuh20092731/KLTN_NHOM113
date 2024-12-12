import { z } from 'zod';

export const RoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(z.string()).optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(RoleSchema).optional(),
});

export const ReviewSchema = z.object({
  reviewId: z.number(),
  rating: z.number(),
  reviewContent: z.string(),
  reviewDate: z.string(),
  timeAgo: z.string(),
  user: UserSchema,
  advertisementId: z.number(),
});

export const ReviewSummarySchema = z.object({
  averageRating: z.number(),
  oneStarCount: z.number(),
  twoStarCount: z.number(),
  threeStarCount: z.number(),
  fourStarCount: z.number(),
  fiveStarCount: z.number(),
  reviews: z.array(ReviewSchema),
});

export type User = z.infer<typeof UserSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewSummary = z.infer<typeof ReviewSummarySchema>;