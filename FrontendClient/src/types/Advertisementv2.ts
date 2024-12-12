import { z } from "zod";
import { MediaSchema } from "./Service";


// Định nghĩa schema cho Advertisement
export const AdvertisementSchema2 = z.object({
  serviceId: z.number(),
  serviceName: z.string(),
  description: z.string(),
  deliveryAvailable: z.boolean(),
  categoryId: z.number(),
  media: z.array(MediaSchema).optional(), // Media là mảng, và có thể không có media
});

// TypeScript interface để sử dụng trong mã
export type Advertisement2 = z.infer<typeof AdvertisementSchema2>;
