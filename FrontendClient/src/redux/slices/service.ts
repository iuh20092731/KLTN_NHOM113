import { createSlice } from "@reduxjs/toolkit";
import {getServiceById, getServiceByName, getServiceByNameCategory} from "../thunks/service";
import { Service } from "../../types/Service";

interface ServiceCategory {
    categoryName: string;
    categoryNameNoDiacritics: string;
    services: Service[];
}

interface ServiceState {
    serviceById: Service | null;
    service: Service[];
    serviceCategory: ServiceCategory | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ServiceState = {
    serviceById: null,
    service: [],
    serviceCategory: null,
    status: 'idle',
    error: null,
};

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        resetService: (state) => {
            state.service = [];
            state.serviceCategory = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getServiceById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getServiceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.serviceById = action.payload as unknown as Service;
            })
            .addCase(getServiceById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

            .addCase(getServiceByName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getServiceByName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.service = action.payload as unknown as Service[];
            })
            .addCase(getServiceByName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })

            .addCase(getServiceByNameCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getServiceByNameCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.serviceCategory = action.payload as unknown as ServiceCategory;
            })
            .addCase(getServiceByNameCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
            
    },
});

export const { resetService } = serviceSlice.actions;
export default serviceSlice.reducer;