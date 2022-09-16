import React, { useEffect, useState } from 'react';
import { BabyBottle, BabyBottleUnit, BabyBottleUnitType } from '@baby-tracker/common-types';
import { Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';

export const BabyBottleForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<BabyBottle>) => {
  const [quantity, setQuantity] = useState<number | undefined>(initialState?.quantity || 1);
  const [unit, setUnit] = useState<BabyBottleUnit>(initialState?.unit || 'ml');

  useEffect(() => {
    const state: BabyBottle = { quantity: quantity || 0, unit };
    onStateChange(state);
    onValidChange(quantity !== undefined && quantity >= 1 && quantity <= 500);
  }, [onStateChange, onValidChange, quantity, unit]);

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <TextField
        type="number"
        required
        fullWidth
        label="Quantité"
        value={quantity}
        disabled={disabled}
        error={quantity === undefined || quantity < 1 || quantity > 500}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || undefined)}
      />
      <ToggleButtonGroup
        color="primary"
        value={unit}
        exclusive
        disabled={disabled}
        onChange={(e, value) => setUnit(value)}
        aria-label="Unité de mesure"
      >
        {Object.keys(BabyBottleUnitType).map((unit) => (
          <ToggleButton key={unit} value={unit}>
            {unit}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
};
