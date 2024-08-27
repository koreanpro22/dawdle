import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface globalEventState {
  currentGlobalEvent: number
}

const initialState: globalEventState = {
  currentGlobalEvent: 0,
}

export const globalEventSlice = createSlice({
  name: 'globalEvent',
  initialState,
  reducers: {
    setGlobalEvent: (state, action: PayloadAction<number>) => {
      state.currentGlobalEvent = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setGlobalEvent } = globalEventSlice.actions;

export const selectCurrentGlobalEvent = (state: RootState) => state.globalEvent.currentGlobalEvent

export default globalEventSlice.reducer