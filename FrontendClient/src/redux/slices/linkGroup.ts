import { LinkGroup } from '@/types/LinkGroup';
import { createSlice } from '@reduxjs/toolkit';
import { getLinkGroup } from '../thunks/linkGroup';

interface LinkGroupState {
    links: LinkGroup[],
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

const initialState: LinkGroupState = {
    links: [],
    status: 'idle',
    error: null
}

const LinkGroupSlice = createSlice({
    name: 'linkgroup',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLinkGroup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getLinkGroup.fulfilled, (state, action) => {
                state.status = 'success';
                state.links = action.payload
            })
            .addCase(getLinkGroup.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload as string;
            })
        }
})

export default LinkGroupSlice.reducer