import { BabyTimelineType, DiaperType } from '../enums';

export type BabyTimeline = {
  id: string;
  type: BabyTimelineType;
  details: unknown;
  achieve_by: string;
  occurred_at: Date;
  created_at: Date;
  updated_at: Date;
};

export type Breastfeeding = {
  left: boolean;
  right: boolean;
};

export type Meal = {
  breast: Breastfeeding;
  quantity: string;
  note?: string;
};

export type Activity = {
  title: string;
  description?: string;
};

export type Diaper = {
  type: DiaperType;
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
  type?: BabyTimelineType;
  userId?: string;
};

export type AddOrUpdateTimelineEntry = {
  type: BabyTimelineType;
  details: unknown;
  occurredAt: Date;
};