import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAccount } from '../thunks/account';
import { UserResponse } from '../../interfaces/UserResponse';

interface AccountState {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  user: null,
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // Có thể thêm các reducers đồng bộ ở đây nếu cần
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action: PayloadAction<UserResponse>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default accountSlice.reducer;

// Selectors
export const selectUser = (state: { account: AccountState }) => state.account.user;
export const selectLoading = (state: { account: AccountState }) => state.account.loading;
export const selectError = (state: { account: AccountState }) => state.account.error;

// Actions
// export const { } = accountSlice.actions; // Uncomment và thêm actions nếu cần
