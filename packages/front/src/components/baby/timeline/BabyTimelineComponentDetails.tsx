import React, { useMemo } from 'react';
import {
  Activity,
  BabyBottle,
  BabyTimelineType,
  Breastfeeding,
  Diaper,
  Meal,
  Medicine,
  Nap,
  Note,
} from '@baby-tracker/common-types';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { ReactComponent as BreastfeedingIcon } from '../../../assets/breastfeeding.svg';
import { ReactComponent as BabyBottleIcon } from '../../../assets/baby-bottle.svg';
import HotelIcon from '@mui/icons-material/Hotel';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import InterestsIcon from '@mui/icons-material/Interests';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { BabyBottleForm } from './forms/BabyBottleForm';
import { BreastfeedingForm } from './forms/BreastfeedingForm';
import { DiaperForm } from './forms/DiaperForm';
import { NapForm } from './forms/NapForm';
import { MealForm } from './forms/MealForm';
import { MedicineForm } from './forms/MedicineForm';
import { ActivityForm } from './forms/ActivityForm';
import { NoteForm } from './forms/NoteForm';

export type ComponentDetails = {
  label: string;
  icon: React.ReactElement;
  color: string;
  form: (props: FormProps<any>) => React.ReactElement;
  computeDescription: (details: any) => React.ReactElement | string;
  computeNote?: (details: any) => React.ReactElement | string;
};

export type BabyTimelineTypeFormProps = FormProps<unknown> & {
  type: BabyTimelineType;
};

export type FormProps<T> = {
  initialState?: T;
  occurredAt: DateTime | null;
  disabled: boolean;
  onStateChange: (state: T) => void;
  onValidChange: (valid: boolean) => void;
};

export const BabyTimelineTypeForm = (props: BabyTimelineTypeFormProps) => {
  const { type, ...formProps } = props;
  const Form = useMemo(() => BabyTimelineComponentDetails[type].form, [type]);
  return <Form {...formProps} />;
};

export const BabyTimelineComponentDetails: { [key in BabyTimelineType]: ComponentDetails } = {
  BABY_BOTTLE: {
    label: 'Biberon',
    form: BabyBottleForm,
    icon: <BabyBottleIcon />,
    color: '#79bbee',
    computeDescription: (details: BabyBottle) => `${details.quantity} ${details.unit}`,
  },
  BREASTFEEDING: {
    label: 'Allaitement',
    form: BreastfeedingForm,
    icon: <BreastfeedingIcon />,
    color: '#edbcdf',
    computeDescription: (details: Breastfeeding) => {
      const { left, right } = details;
      if (left && right) {
        return 'Seins gauche / droite';
      }
      return `Sein ${left ? 'gauche' : 'droit'}`;
    },
  },
  MEAL: {
    label: 'Repas',
    form: MealForm,
    icon: <RestaurantIcon />,
    color: '#f2c678',
    computeDescription: (details: Meal) => `${details.meal}`,
  },
  DIAPER: {
    label: 'Couche',
    form: DiaperForm,
    icon: <BabyChangingStationIcon />,
    color: '#75aea7',
    computeDescription: (details: Diaper) => {
      const { pee, poop } = details;
      if (pee && poop) {
        return 'Mouillée et Selles';
      }
      return pee ? 'Mouillée' : 'Selles';
    },
  },
  MEDICINE: {
    label: 'Médicament',
    form: MedicineForm,
    icon: <MedicalServicesIcon />,
    color: '#ef7386',
    computeDescription: (details: Medicine) => `${details.name}`,
  },
  ACTIVITY: {
    label: 'Activité',
    form: ActivityForm,
    icon: <InterestsIcon />,
    color: '#9fd573',
    computeDescription: (details: Activity) => `${details.title}`,
  },
  NAP: {
    label: 'Sieste',
    form: NapForm,
    icon: <HotelIcon />,
    color: '#3d588d',
    computeDescription: (details: Nap) => {
      const hours = details.duration_minutes / 60;
      const rHours = Math.floor(hours);
      const minutes = (hours - rHours) * 60;
      const rMinutes = Math.round(minutes);
      const formattedHours = rHours !== 0 ? `${rHours} heure${rHours > 1 ? 's' : ''} et ` : '';
      return `${formattedHours} ${rMinutes} minute${rMinutes > 1 ? 's' : ''}.`;
    },
  },
  NOTE: {
    label: 'Note',
    form: NoteForm,
    icon: <StickyNote2Icon />,
    color: '#aaaaaa',
    computeDescription: (details: Note) => <Typography variant="body2">{details.content}</Typography>,
  },
};
