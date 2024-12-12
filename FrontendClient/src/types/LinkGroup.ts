import { z } from 'zod';

export const LinkGroupSchema = z.object({
    id: z.number(),
    serial: z.number(),
    platform: z.string(),
    groupName: z.string(),
    groupLink: z.string(),
    description: z.string().nullable(),
    remark: z.string().nullable(),
    isActive: z.boolean(),
    imageUrl: z.string()
});

export type LinkGroup = z.infer<typeof LinkGroupSchema>;