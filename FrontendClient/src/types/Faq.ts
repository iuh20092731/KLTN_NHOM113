import { z } from 'zod';

export const FaqSchema = z.object({
  faqId: z.number(),
  question: z.string(),
  answer: z.string(),
  advertisementId: z.number()
});

export type Faq = z.infer<typeof FaqSchema>;