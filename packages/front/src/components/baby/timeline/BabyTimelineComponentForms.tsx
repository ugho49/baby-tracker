import React, { useMemo } from 'react';
import { BabyTimelineType } from '@baby-tracker/common-types';
import { BabyBottleForm } from './types-form/BabyBottleForm';
import { BreastfeedingForm } from './types-form/BreastfeedingForm';

export type FormProps<T> = {
  initialState?: T;
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

export const BabyTimelineComponentForms: { [key in BabyTimelineType]: (props: FormProps<any>) => React.ReactElement } =
  {
    BABY_BOTTLE: BabyBottleForm,
    BREASTFEEDING: BreastfeedingForm,
    MEAL: (props) => <div>Meal form</div>, // TODO
    DIAPER: (props) => <div>Diaper form</div>, // TODO
    MEDICINE: (props) => <div>Medicine form</div>, // TODO
    ACTIVITY: (props) => <div>Activity form</div>, // TODO
    NAP: (props) => <div>Nap form</div>, // TODO
    NOTE: (props) => <div>Note form</div>, // TODO
  };
