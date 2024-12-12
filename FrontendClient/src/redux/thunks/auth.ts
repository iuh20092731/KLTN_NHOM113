import { createAsyncThunk } from "@reduxjs/toolkit";
import { patch, post } from "../../services/api.service";
import { Credentials, LoginResponse, RegisterCredentials, RegisterResponse, VerifyOTPResponse } from "../../types/Auth";
import { ENDPOINTS } from "../../constants/endpoints";
// Thunk để login người dùng
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      // Gọi API để đăng nhập người dùng
      const response = await post<LoginResponse>(ENDPOINTS.LOGIN, credentials);     
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { oldPassword, newPassword, userId, token }: { oldPassword: string; newPassword: string; userId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await patch<{ result: string }>(
        `${ENDPOINTS.CHANGE_PASSWORD}/users/${userId}/update-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.result;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return rejectWithValue("Mật khẩu cũ không đúng");
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      // Mã hóa email và OTP chỉ một lần
      const encodedEmail = encodeURIComponent(email);
      const encodedOtp = encodeURIComponent(otp);
      const url = `${ENDPOINTS.VERIFY_OTP}?email=${encodedEmail}&otpCode=${encodedOtp}`;      
      const response = await post<VerifyOTPResponse>(url);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOTP",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await post<VerifyOTPResponse>(`${ENDPOINTS.RESEND_OTP}`, { email: email });
      return response.data;
    }
    catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk để đăng ký người dùng
export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await post<RegisterResponse>(ENDPOINTS.REGISTER, credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleUserInfo: { familyName: string, givenName: string, email: string, avatar: string }, { rejectWithValue }) => {
    try {
      const response = await post(`${ENDPOINTS.LOGIN_WITH_GG}`, {
        email: googleUserInfo.email,
        givenName: googleUserInfo.givenName,
        familyName: googleUserInfo.familyName,
        avatar: googleUserInfo.avatar
      });
      // Lưu token vào localStorage
      if (response.data && typeof response.data === 'object' && 'token' in response.data) {
        localStorage.setItem('token', response.data.token as string);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        (error as any).response?.data || "Đăng nhập với Google thất bại"
      );
    }
  }
);

export const loginWithFacebook = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleUserInfo: { familyName: string, givenName: string, email: string, avatar: string; accessToken: string  }, { rejectWithValue }) => {
    try {
      const response = await post(`${ENDPOINTS.LOGIN_WITH_GG}`, {
        email: googleUserInfo.email,
        givenName: googleUserInfo.givenName,
        familyName: googleUserInfo.familyName,
        avatar: googleUserInfo.avatar,
        access_token: googleUserInfo.accessToken
      });
      // Lưu token vào localStorage
      if (response.data && typeof response.data === 'object' && 'token' in response.data) {
        localStorage.setItem('token', response.data.token as string);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        (error as any).response?.data || "Đăng nhập với Google thất bại"
      );
    }
  }
);

