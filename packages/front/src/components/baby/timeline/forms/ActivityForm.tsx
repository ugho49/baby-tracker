import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from '@baby-tracker/common-types';
import { Stack, TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import { isBlank } from '../../../../utils';

const TITLE_MAX_LENGTH = 60;

export const ActivityForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Activity>) => {
  const [title, setTitle] = useState<string | undefined>(initialState?.title || '');
  const [note, setNote] = useState<string | undefined>(initialState?.note);

  const titleMaxLengthExceeded = useMemo(() => title !== undefined && title.length > TITLE_MAX_LENGTH, [title]);

  useEffect(() => {
    const state: Activity = { title: title || '', note: note === '' ? undefined : note };
    onStateChange(state);
    onValidChange(!isBlank(title) && !titleMaxLengthExceeded);
  }, [onStateChange, onValidChange, title, note, titleMaxLengthExceeded]);

  return (
    <Stack sx={{ display: 'flex', gap: 2 }}>
      <TextField
        label="Activité"
        disabled={disabled}
        fullWidth
        value={title}
        error={titleMaxLengthExceeded}
        helperText={titleMaxLengthExceeded && `${TITLE_MAX_LENGTH} Caractères maximum`}
        onChange={(e) => setTitle(e.target.value)}
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
