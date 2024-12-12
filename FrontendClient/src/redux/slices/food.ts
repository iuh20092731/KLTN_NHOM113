import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTopFoodsThunk } from "../thunks/food";
import { FoodItem } from "@/types/Food";
import { ApiResponse } from "@/types/ApiResponse";

interface FoodState {
    topFoods: FoodItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FoodState = {
    topFoods: [],
    status: 'idle',
    error: null,
};

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTopFoodsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTopFoodsThunk.fulfilled, (state, action: PayloadAction<ApiResponse<FoodItem>>) => {
                state.status = 'succeeded';
                state.topFoods = action.payload.result;
            })
            .addCase(getTopFoodsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Không thể lấy danh sách món ăn hàng đầu';
            });
    },
});

export default foodSlice.reducer;