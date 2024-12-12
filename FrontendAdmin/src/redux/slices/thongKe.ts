import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchVisitStats } from "../thunks/thongKe";

interface VisitStats {
  totalVisits: number;
  visitRateComparedToPreviousMonth: number;
}

interface ThongKeState {
  visitStats: VisitStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThongKeState = {
  visitStats: null,
  loading: false,
  error: null,
};

const thongKeSlice = createSlice({
  name: "thongKe",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisitStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitStats.fulfilled, (state, action: PayloadAction<VisitStats>) => {
        state.loading = false;
        state.visitStats = action.payload;
      })
      .addCase(fetchVisitStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = thongKeSlice.actions;

export default thongKeSlice.reducer;