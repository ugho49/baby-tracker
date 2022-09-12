import { AnyApiFactory, createApiFactory } from './system/ApiFactory';
import { BabyTrackerApiImpl, babyTrackerApiRef } from './baby-tracker.api';

export * from './system/useApi';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: babyTrackerApiRef,
    factory: () => new BabyTrackerApiImpl(),
  }),
];
