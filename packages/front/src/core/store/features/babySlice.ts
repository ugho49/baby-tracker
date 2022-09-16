import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BabyRelation, BabyTimeline, BabyTimelineEntry, BabyWithUserAuthority } from '@baby-tracker/common-types';
import { DateTime } from 'luxon';

export interface BabyState {
  babies?: BabyWithUserAuthority[];
  currentBaby?: BabyWithUserAuthority & {
    timeline?: BabyTimeline;
    timelineRefreshAt?: string;
    relations?: BabyRelation[];
    relationsRefreshAt?: string;
  };
}

const initialState: BabyState = {
  babies: undefined,
  currentBaby: undefined,
};

export const babySlice = createSlice({
  name: 'baby',
  initialState,
  reducers: {
    setBabies: (state, action: PayloadAction<BabyWithUserAuthority[]>) => {
      state.babies = action.payload;
    },
    setCurrentBaby: (state, action: PayloadAction<BabyWithUserAuthority>) => {
      state.currentBaby = action.payload;
    },
    setTimeline: (state, action: PayloadAction<BabyTimeline>) => {
      if (state.currentBaby) {
        state.currentBaby.timeline = action.payload;
        state.currentBaby.timelineRefreshAt = DateTime.now().toISO();
      }
    },
    setTimelineEntry: (state, action: PayloadAction<BabyTimelineEntry>) => {
      if (state?.currentBaby?.timeline) {
        state.currentBaby.timeline.entries.push(action.payload);
      }
    },
    resetCurrentBaby: (state) => {
      state.currentBaby = undefined;
    },
  },
});

export const { setBabies, setCurrentBaby, setTimeline, setTimelineEntry, resetCurrentBaby } = babySlice.actions;
