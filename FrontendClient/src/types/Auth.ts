import { z } from 'zod';

// Schema cho Credentials
export const CredentialsSchema = z.object({
  username: z.string().min(4, 'Tên người dùng phải có ít nhất 4 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Schema cho LoginResponse
export const LoginResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    token: z.string(),
    authenticated: z.boolean(),
  }),
});

export const VerifyOPTSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    userId: z.string(),
    email: z.string(),
    verified: z.boolean(),
    message: z.string(),
  }),
});

// Schema cho RegisterCredentials
export const RegisterCredentialsSchema = z.object({
  username: z.string().min(4, 'Tên người dùng phải có ít nhất 4 ký tự'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  firstName: z.string().min(1, 'Họ phải có ít nhất 1 ký tự'),
  lastName: z.string().min(1, 'Tên phải có ít nhất 1 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phoneNumber: z.string().regex(/^\d+$/, 'Số điện thoại chỉ được chứa số').min(10, 'Số điện thoại phải có ít nhất 10 số'),
  userType: z.string(),
  deviceInfo: z.string(),
});

// Schema cho RegisterResponse
export const RegisterResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.object({
    userId: z.string(),
    email: z.string(),
    otp: z.string(),
    verified: z.string(),
    message: z.string(),
    message2: z.string(),
  }),
});

// Xuất kiểu dữ liệu từ schema RegisterResponse
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;


// Xuất kiểu dữ liệu từ schema
export type Credentials = z.infer<typeof CredentialsSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;
export type VerifyOTPResponse = z.infer<typeof VerifyOPTSchema>;
