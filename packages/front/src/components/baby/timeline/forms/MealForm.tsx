import React, { useEffect, useState } from 'react';
import { Meal } from '@baby-tracker/common-types';
import { Stack, TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import { DateTime } from 'luxon';
import { MobileTimePicker } from '@mui/x-date-pickers';
import { isBlank } from '../../../../utils';

export const MealForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Meal>) => {
  const [meal, setMeal] = useState<string | undefined>(initialState?.meal || '');
  const [note, setNote] = useState<string | undefined>(initialState?.note);

  useEffect(() => {
    const state: Meal = { meal: meal || '', note: note === '' ? undefined : note };
    onStateChange(state);
    onValidChange(!isBlank(meal));
  }, [onStateChange, onValidChange, meal, note]);

  return (
    <Stack sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Repas"
        disabled={disabled}
        fullWidth
        value={meal}
        error={meal !== undefined && meal.length > 60}
        placeholder="Ex: Purée carotte, petit pot, yaourt etc ..."
        onChange={(e) => setMeal(e.target.value)}
      />
      <TextField
        label="Note"
        disabled={disabled}
        fullWidth
        multiline
        minRows={2}
        maxRows={15}
        value={note}
        placeholder="Ajouter une note"
        onChange={(e) => setNote(e.target.value)}
      />
    </Stack>
  );
};
