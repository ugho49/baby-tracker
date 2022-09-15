import { AnyApiFactory, createApiFactory } from '@baby-tracker/common-front';
import { BabyTrackerApiImpl, babyTrackerApiRef } from './baby-tracker.api';

export { babyTrackerApiRef } from './baby-tracker.api';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: babyTrackerApiRef,
    factory: () => new BabyTrackerApiImpl(),
  }),
];
