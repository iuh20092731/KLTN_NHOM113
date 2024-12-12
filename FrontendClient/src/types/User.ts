import { z } from 'zod';

// Schema cho UserInfoResponse
export const UserInfoResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    zalo: z.string(),
    facebook: z.string(),
    avatar: z.string(),
    active: z.boolean(),
    hasPassword: z.boolean(),
  }),
});

export const UpdateUserResponseSchema = z.object({
  code: z.number(),
  result: z.object({
    id: z.string(),
    username: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    avatar: z.string().nullable(),
  })
});

// Xuất kiểu dữ liệu từ schema UserInfoResponse
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>;
export type UserInfo = UserInfoResponse['result'];
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;