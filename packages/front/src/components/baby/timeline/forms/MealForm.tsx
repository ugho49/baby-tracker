import React, { useEffect, useMemo, useState } from 'react';
import { Meal } from '@baby-tracker/common-types';
import { Stack, TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import { isBlank } from '../../../../utils';

const MEAL_MAX_LENGTH = 60;

export const MealForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Meal>) => {
  const [meal, setMeal] = useState<string | undefined>(initialState?.meal || '');
  const [note, setNote] = useState<string | undefined>(initialState?.note);

  const mealMaxLengthExceeded = useMemo(() => meal !== undefined && meal.length > MEAL_MAX_LENGTH, [meal]);

  useEffect(() => {
    const state: Meal = { meal: meal || '', note: note === '' ? undefined : note };
    onStateChange(state);
    onValidChange(!isBlank(meal) && !mealMaxLengthExceeded);
  }, [onStateChange, onValidChange, meal, note, mealMaxLengthExceeded]);

  return (
    <Stack sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Repas"
        disabled={disabled}
        fullWidth
        value={meal}
        error={mealMaxLengthExceeded}
        helperText={mealMaxLengthExceeded && `${MEAL_MAX_LENGTH} Caractères maximum`}
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
