import React, { useMemo } from 'react';
import { BabyTimelineType } from '@baby-tracker/common-types';
import { BabyBottleForm } from './forms/BabyBottleForm';
import { BreastfeedingForm } from './forms/BreastfeedingForm';
import { DiaperForm } from './forms/DiaperForm';
import { NapForm } from './forms/NapForm';
import { DateTime } from 'luxon';

export type FormProps<T> = {
  initialState?: T;
  occurredAt: DateTime | null;
  disabled: boolean;
  onStateChange: (state: T) => void;
  onValidChange: (valid: boolean) => void;
};

export type BabyTimelineTypeFormProps = FormProps<unknown> & {
  type: BabyTimelineType;
};

export const BabyTimelineTypeForm = (props: BabyTimelineTypeFormProps) => {
  const { type, ...formProps } = props;
  const Form = useMemo(() => BabyTimelineComponentForms[type], [type]);
  return <Form {...formProps} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BabyTimelineComponentForms: { [key in BabyTimelineType]: (props: FormProps<any>) => React.ReactElement } =
  {
    BABY_BOTTLE: BabyBottleForm,
    BREASTFEEDING: BreastfeedingForm,
    DIAPER: DiaperForm,
    NAP: NapForm,
    MEAL: (props) => <div>Meal form</div>, // TODO
    MEDICINE: (props) => <div>Medicine form</div>, // TODO
    ACTIVITY: (props) => <div>Activity form</div>, // TODO
    NOTE: (props) => <div>Note form</div>, // TODO
  };
