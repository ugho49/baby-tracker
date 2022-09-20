import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BabyRelation, BabyTimeline, BabyTimelineEntry, BabyWithUserAuthority } from '@baby-tracker/common-types';
import { DateTime } from 'luxon';

export interface BabyState {
  loadBabies?: boolean;
  babies?: BabyWithUserAuthority[];
  currentBaby?: BabyWithUserAuthority & {
    timelineAvailableDays: string[];
    timelineLoadedDays: string[];
    timelineEntries: { [key in string]: BabyTimelineEntry[] };
    timelineRefreshAt?: string;
    relations: BabyRelation[];
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
      state.currentBaby = {
        ...action.payload,
        timelineAvailableDays: [],
        timelineLoadedDays: [],
        timelineEntries: {},
        relations: [],
      };
    },
    setTimeline: (state, action: PayloadAction<BabyTimeline>) => {
      if (!state.currentBaby) {
        return;
      }

      const { payload } = action;

      if (payload.pagination) {
        const day = payload.pagination.current_day;
        state.currentBaby.timelineEntries[day] = payload.resources;
        state.currentBaby.timelineAvailableDays = payload.pagination.available_days;

        if (!state.currentBaby.timelineLoadedDays.includes(day)) {
          state.currentBaby.timelineLoadedDays.push(day);
        }
      }

      state.currentBaby.timelineRefreshAt = DateTime.now().toISO();
    },
    timelineRefreshed: (state) => {
      if (state.currentBaby) {
        state.currentBaby.timelineRefreshAt = DateTime.now().toISO();
      }
    },
    addTimelineEntry: (state, action: PayloadAction<BabyTimelineEntry>) => {
      if (!state.currentBaby) {
        return;
      }
      const day = DateTime.fromISO(action.payload.occurred_at).toISODate();
      if (!state.currentBaby.timelineLoadedDays.includes(day)) {
        state.currentBaby.timelineLoadedDays.push(day);
        state.currentBaby.timelineEntries[day] = [];
      }
      state.currentBaby.timelineEntries[day].push(action.payload);
    },
    editTimelineEntry: (state, action: PayloadAction<BabyTimelineEntry>) => {
      if (!state?.currentBaby?.timelineEntries) {
        return;
      }

      const id = action.payload.id;
      const editEntryDay = DateTime.fromISO(action.payload.occurred_at).toISODate();

      Object.entries(state.currentBaby.timelineEntries).forEach(([day, timelineEntries]) => {
        const index = timelineEntries.findIndex((entry) => entry.id === id);

        if (index === -1) {
          return;
        }

        if (!state?.currentBaby?.timelineEntries) {
          return;
        }

        if (day === editEntryDay) {
          state.currentBaby.timelineEntries[day][index] = action.payload;
        } else {
          state.currentBaby.timelineEntries[day] = state.currentBaby.timelineEntries[day].filter((e) => e.id !== id);

          if (!state.currentBaby.timelineLoadedDays.includes(editEntryDay)) {
            state.currentBaby.timelineLoadedDays.push(editEntryDay);
            state.currentBaby.timelineEntries[editEntryDay] = [];
          }

          state.currentBaby.timelineEntries[editEntryDay].push(action.payload);
        }
      });
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
