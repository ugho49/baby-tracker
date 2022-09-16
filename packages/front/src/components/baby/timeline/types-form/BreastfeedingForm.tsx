import React, { useEffect, useState } from 'react';
import { Breastfeeding } from '@baby-tracker/common-types';
import { Stack, ToggleButton, Typography } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  button: { flexGrow: 1 },
  leftIcon: { marginRight: 16 },
  rightIcon: { marginLeft: 16 },
  iconClicked: {
    color: '#ff4e4e',
  },
});

export const BreastfeedingForm = ({
  onStateChange,
  onValidChange,
  disabled,
  initialState,
}: FormProps<Breastfeeding>) => {
  const classes = useStyles();
  const [left, setLeft] = useState<boolean>(initialState?.left || false);
  const [right, setRight] = useState<boolean>(initialState?.right || false);

  useEffect(() => {
    const state: Breastfeeding = { left, right };
    onStateChange(state);
    onValidChange(left || right);
  }, [onStateChange, onValidChange, left, right]);

  return (
    <>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Quel(s) sein(s) ?
      </Typography>

      <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
        <ToggleButton
          disabled={disabled}
          className={classes.button}
          value="left"
          selected={left}
          onChange={() => setLeft((prev) => !prev)}
        >
          {left ? (
            <FavoriteTwoToneIcon className={`${classes.leftIcon} ${classes.iconClicked}`} />
          ) : (
            <FavoriteBorderTwoToneIcon className={classes.leftIcon} />
          )}
          <div>Gauche</div>
        </ToggleButton>
        <ToggleButton
          disabled={disabled}
          className={classes.button}
          value="right"
          selected={right}
          onChange={() => setRight((prev) => !prev)}
        >
          <div>Droite</div>
          {right ? (
            <FavoriteTwoToneIcon className={`${classes.rightIcon} ${classes.iconClicked}`} />
          ) : (
            <FavoriteBorderTwoToneIcon className={classes.rightIcon} />
          )}
        </ToggleButton>
      </Stack>
    </>
  );
};
