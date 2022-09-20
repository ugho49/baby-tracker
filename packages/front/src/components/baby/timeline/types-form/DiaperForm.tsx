import React, { useEffect, useState } from 'react';
import { Diaper } from '@baby-tracker/common-types';
import { Stack, ToggleButton } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  button: { flexGrow: 1 },
});

export const DiaperForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Diaper>) => {
  const classes = useStyles();
  const [pee, setPee] = useState<boolean>(initialState?.pee || false);
  const [poop, setPoop] = useState<boolean>(initialState?.poop || false);

  useEffect(() => {
    const state: Diaper = { pee, poop };
    onStateChange(state);
    onValidChange(pee || poop);
  }, [onStateChange, onValidChange, pee, poop]);

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
      <ToggleButton
        className={classes.button}
        color="secondary"
        disabled={disabled}
        value="pee"
        selected={pee}
        onChange={() => setPee((prev) => !prev)}
      >
        <div>Mouillée</div>
      </ToggleButton>
      <ToggleButton
        className={classes.button}
        color="secondary"
        disabled={disabled}
        value="poop"
        selected={poop}
        onChange={() => setPoop((prev) => !prev)}
      >
        <div>Selles</div>
      </ToggleButton>
    </Stack>
  );
};