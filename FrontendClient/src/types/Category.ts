import { z } from "zod";

export const CategorySchema = z.object({
  categoryId: z.number(),
  categorySeq: z.number(),
  categoryName: z.string(),
  imageLink: z.string().url(),
  categoryNameNoDiacritics: z.string(),
  createdDate: z.string(),
  updatedDate: z.string(),
  advertisementServices: z.string().nullable(),
  isActive: z.boolean(),
});

export type Category = z.infer<typeof CategorySchema>;
