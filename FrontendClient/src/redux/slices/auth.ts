import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, register } from '../thunks/auth';
import { LoginResponse, RegisterResponse } from '../../types/Auth';
import { isTokenValid } from '../../utils/token';

interface AuthState {
  user: { id: string } | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearInvalidToken: (state) => {
      if (state.token && !isTokenValid(state.token)) {
        state.token = null;
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.user = null;
        state.token = action.payload.result.token;
        if (isTokenValid(action.payload.result.token)) {
          localStorage.setItem('token', action.payload.result.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.status = 'succeeded';
        state.user = { id: action.payload.result.userId };
        state.token = null; 
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearInvalidToken } = authSlice.actions;
export default authSlice.reducer;
