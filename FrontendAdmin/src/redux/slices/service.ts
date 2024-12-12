import { createSlice } from "@reduxjs/toolkit";
import {getServiceByName, getServices} from "../thunks/service";
import { Service } from "../../interfaces/Service";

interface ServiceState {
    service: Service[];
    serviceAll: Service[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ServiceState = {
    service: [],
    serviceAll: [],
    status: 'idle',
    error: null,
};

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        resetService: (state) => {
            state.service = [];
            state.serviceAll = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getServiceByName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getServiceByName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.service = Array.isArray(action.payload) ? action.payload : [action.payload];
            })
            .addCase(getServiceByName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            })
            .addCase(getServices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getServices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.serviceAll = action.payload;
            })
            .addCase(getServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? null;
            });
    },
});

export const { resetService } = serviceSlice.actions;
export default serviceSlice.reducer;