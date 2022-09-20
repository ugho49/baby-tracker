import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BabyRelation, BabyTimeline, BabyTimelineEntry, BabyWithUserAuthority } from '@baby-tracker/common-types';
import { DateTime } from 'luxon';

export interface BabyState {
  loadBabies?: boolean;
  babies?: BabyWithUserAuthority[];
  currentBaby?: BabyWithUserAuthority & {
    timelineEntries?: BabyTimelineEntry[];
    timelineRefreshAt?: string;
    relations?: BabyRelation[];
    relationsRefreshAt?: string;
  };
}

const initialState: BabyState = {
  loadBabies: undefined,
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
    setLoadBabies: (state, action: PayloadAction<boolean>) => {
      state.loadBabies = action.payload;
    },
    setCurrentBaby: (state, action: PayloadAction<BabyWithUserAuthority>) => {
      state.currentBaby = action.payload;
    },
    setTimeline: (state, action: PayloadAction<BabyTimeline>) => {
      if (state.currentBaby) {
        state.currentBaby.timelineEntries = action.payload.resources;
        state.currentBaby.timelineRefreshAt = DateTime.now().toISO();
      }
    },
    timelineRefreshed: (state) => {
      if (state.currentBaby) {
        state.currentBaby.timelineRefreshAt = DateTime.now().toISO();
      }
    },
    addTimelineEntry: (state, action: PayloadAction<BabyTimelineEntry>) => {
      if (state?.currentBaby?.timelineEntries) {
        state.currentBaby.timelineEntries.push(action.payload);
      }
    },
    editTimelineEntry: (state, action: PayloadAction<BabyTimelineEntry>) => {
      if (!state?.currentBaby?.timelineEntries) {
        return;
      }
      const index = state.currentBaby.timelineEntries.findIndex((entry) => entry.id === action.payload.id);
      if (index === -1) {
        return;
      }
      state.currentBaby.timelineEntries[index] = action.payload;
    },
    resetCurrentBaby: (state) => {
      state.currentBaby = undefined;
    },
    resetBabyState: (state) => {
      state.loadBabies = undefined;
      state.currentBaby = undefined;
      state.babies = undefined;
    },
  },
});

export const {
  setBabies,
  setCurrentBaby,
  setTimeline,
  addTimelineEntry,
  editTimelineEntry,
  resetCurrentBaby,
  resetBabyState,
  timelineRefreshed,
  setLoadBabies,
} = babySlice.actions;
