import { createSlice } from "@reduxjs/toolkit";
import { getTotalVisit, incrementVisit } from "@/redux/thunks/visit";

interface VisitState {
  totalVisit: number | null;
  incrementVisit: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: VisitState = {
  totalVisit: null,
  incrementVisit: null,
  loading: false,
  error: null,
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.totalVisit = action.payload;
      })
      .addCase(getTotalVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(incrementVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.incrementVisit = action.payload ?? null;
      })
      .addCase(incrementVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default visitSlice.reducer;
