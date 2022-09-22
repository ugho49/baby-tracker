import React, { useEffect, useState } from 'react';
import { Nap } from '@baby-tracker/common-types';
import { Stack, TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentForms';
import { DateTime, Interval } from 'luxon';
import { MobileTimePicker } from '@mui/x-date-pickers';

export const NapForm = ({ onStateChange, onValidChange, disabled, occurredAt, initialState }: FormProps<Nap>) => {
  const [note, setNote] = useState<string | undefined>(initialState?.note);
  const [endAt, setEndAt] = useState<DateTime | null>(
    (occurredAt || DateTime.now()).plus({ minute: initialState?.duration_minutes || 30 })
  );

  useEffect(() => {
    const duration =
      occurredAt === null || endAt === null ? 0 : Interval.fromDateTimes(occurredAt, endAt).length('minutes') || 0;
    const state: Nap = { duration_minutes: Math.round(duration), note: note === '' ? undefined : note };
    onStateChange(state);
    onValidChange(endAt !== null && duration !== 0);
  }, [onStateChange, onValidChange, occurredAt, endAt, note]);

  useEffect(() => {
    if (!occurredAt || !endAt) return;
    if (occurredAt.toISODate() !== endAt.toISODate()) {
      const newEndAt = endAt.set({ year: occurredAt.year, month: occurredAt.month, day: occurredAt.day });
      setEndAt(newEndAt);
    }
  }, [occurredAt, endAt]);

  return (
    <Stack sx={{ display: 'flex', gap: 2 }}>
      <MobileTimePicker
        label="Heure de fin de la sieste"
        inputFormat="HH:mm"
        disabled={disabled}
        value={endAt}
        onChange={(date) => setEndAt(date)}
        minTime={occurredAt}
        maxTime={DateTime.now()}
        renderInput={(params) => <TextField {...params} />}
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
