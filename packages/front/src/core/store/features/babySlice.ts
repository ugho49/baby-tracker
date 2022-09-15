import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BabyTimeline, BabyWithUserAuthority } from '@baby-tracker/common-types';

export interface BabyState {
  babies?: BabyWithUserAuthority[];
  currentBabyId?: string;
  timeline: BabyTimeline[];
}

const initialState: BabyState = {
  babies: undefined,
  currentBabyId: undefined,
  timeline: [],
};

export const babySlice = createSlice({
  name: 'baby',
  initialState,
  reducers: {
    setBabies: (state, action: PayloadAction<BabyWithUserAuthority[]>) => {
      state.babies = action.payload;
    },
    setCurrentBabyId: (state, action: PayloadAction<string>) => {
      state.currentBabyId = action.payload;
    },
    setTimeline: (state, action: PayloadAction<BabyTimeline[]>) => {
      state.timeline = action.payload;
    },
  },
});

export const { setBabies, setCurrentBabyId, setTimeline } = babySlice.actions;