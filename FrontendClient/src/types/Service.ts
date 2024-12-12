import { z } from "zod";

// Media schema
export const MediaSchema = z.object({
  mediaId: z.number(),
  mediaUrl: z.string().nullable(), // Có thể null
  serviceId: z.number().nullable(), // Có thể null
});

// Service schema
export const ServiceSchema = z.object({
  serviceId: z.number(),
  serviceName: z.string().nullable(), // Có thể null
  description: z.string().nullable(), // Có thể null
  deliveryAvailable: z.boolean().nullable(), // Có thể null
  categoryId: z.number().nullable(), // Có thể null
  media: z.array(MediaSchema).nullable(), // Có thể null
  categoryName: z.string().nullable(), // Có thể null
  categoryNameNoDiacritics: z.string().nullable()

});

// Inferred types
export type Media = z.infer<typeof MediaSchema>;
export type Service = z.infer<typeof ServiceSchema>;
