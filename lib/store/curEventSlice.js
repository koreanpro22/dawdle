import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    curEvent: null,
};

const curEventSlice = createSlice({
    name: 'curEvent',
    initialState,
    reducers: {
        setCurEvent: (state, action) => {
            state.curEvent = action.payload;
        }
    }
});

export const { setCurEvent } = curEventSlice.actions;

export const selectCurEvent = state => state?.curEvent?.curEvent;

export default curEventSlice.reducer;
