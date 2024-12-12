import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserInfo } from '../thunks/user';
import { UserInfo } from '../../types/User';

interface UserState {
  userState: any;
  isLogin: boolean;
  userInfo: UserInfo | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  isLogin: false,
  userInfo: null,
  status: 'idle',
  error: null,
  userState: undefined
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isLogin = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<{ result: UserInfo }>) => {
        state.status = 'succeeded';
        state.userInfo = action.payload.result;
        state.isLogin = true;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isLogin = false;
      });
  },
});

export const { setIsLogin, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
