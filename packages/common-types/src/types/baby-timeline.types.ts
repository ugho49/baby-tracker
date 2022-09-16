import { BabyBottleUnitType, BabyTimelineType } from '../enums';

export type BabyTimelinePagination = {
  available_days: string[];
  current_day: string;
  previous_day: string | null;
  next_day: string | null;
};

export type BabyTimeline = {
  resources: BabyTimelineEntry[];
  pagination?: BabyTimelinePagination;
};

export type BabyTimelineEntry = {
  id: string;
  type: BabyTimelineType;
  details: unknown;
  achieve_by: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export type Breastfeeding = {
  left: boolean;
  right: boolean;
};

export type BabyBottleUnit = keyof typeof BabyBottleUnitType;

export type BabyBottle = {
  quantity: number;
  unit: BabyBottleUnit;
  note?: string;
};

export type Meal = {
  meal: string;
  note?: string;
};

export type Activity = {
  title: string;
  description?: string;
};

export type Diaper = {
  pee: boolean;
  poop: boolean;
  note?: string;
};

export type Medicine = {
  name: string;
  dosage?: string;
  note?: string;
};

export type Nap = {
  duration_minutes: number;
  note?: string;
};

export type Note = {
  content: string;
};

export type GetTimelineQuery = {
  day?: string;
  order?: 'asc' | 'desc';
  type?: BabyTimelineType;
  userId?: string;
};

export type AddOrUpdateTimelineEntry = {
  type: BabyTimelineType;
  details: unknown;
  occurredAt: string;
};
