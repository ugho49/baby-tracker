import React from 'react';
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

type ComponentDetails = {
  label: string;
  icon: React.ReactElement;
  color: string;
  computeDescription: (details: any) => React.ReactElement | string;
  computeNote?: (details: any) => React.ReactElement | string;
};

export const BabyTimelineComponentDetails: { [key in BabyTimelineType]: ComponentDetails } = {
  BABY_BOTTLE: {
    label: 'Biberon',
    icon: <BabyBottleIcon />,
    color: '#79bbee',
    computeDescription: (details: BabyBottle) => `${details.quantity} ${details.unit}`,
  },
  BREASTFEEDING: {
    label: 'Allaitement',
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
    icon: <RestaurantIcon />,
    color: '#f2c678',
    computeDescription: (details: Meal) => `${details.meal}`,
  },
  DIAPER: {
    label: 'Couche',
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
    icon: <MedicalServicesIcon />,
    color: '#ef7386',
    computeDescription: (details: Medicine) => `${details.name}`,
  },
  ACTIVITY: {
    label: 'Activité',
    icon: <InterestsIcon />,
    color: '#9fd573',
    computeDescription: (details: Activity) => `${details.title}`,
  },
  NAP: {
    label: 'Sieste',
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
    label: '',
    icon: <StickyNote2Icon />,
    color: '#aaaaaa',
    computeDescription: (details: Note) => <Typography variant="body2">{details.content}</Typography>,
  },
};
