import React, { useEffect, useMemo, useState } from 'react';
import { Medicine } from '@baby-tracker/common-types';
import { Stack, TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentDetails';
import { isBlank } from '../../../../utils';

const NAME_MAX_LENGTH = 60;
const DOSAGE_MAX_LENGTH = 30;

export const MedicineForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Medicine>) => {
  const [name, setName] = useState<string>(initialState?.name || '');
  const [dosage, setDosage] = useState<string | undefined>(initialState?.dosage);
  const [note, setNote] = useState<string | undefined>(initialState?.note);

  const nameMaxLengthExceeded = useMemo(() => name !== undefined && name.length > NAME_MAX_LENGTH, [name]);
  const dosageMaxLengthExceeded = useMemo(() => dosage !== undefined && dosage.length > DOSAGE_MAX_LENGTH, [dosage]);

  useEffect(() => {
    const state: Medicine = {
      name: name || '',
      dosage: dosage === '' ? undefined : dosage,
      note: note === '' ? undefined : note,
    };
    onStateChange(state);
    onValidChange(!isBlank(name) && !nameMaxLengthExceeded && !dosageMaxLengthExceeded);
  }, [onStateChange, onValidChange, name, dosage, note, nameMaxLengthExceeded, dosageMaxLengthExceeded]);

  return (
    <Stack sx={{ display: 'flex', gap: 2 }}>
      <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <TextField
          label="Nom du médicament"
          disabled={disabled}
          value={name}
          error={nameMaxLengthExceeded}
          helperText={nameMaxLengthExceeded && `${NAME_MAX_LENGTH} Caractères maximum`}
          placeholder="Ex: Vitamine D, etc ..."
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Dosage"
          disabled={disabled}
          value={dosage}
          error={dosageMaxLengthExceeded}
          helperText={dosageMaxLengthExceeded && `${DOSAGE_MAX_LENGTH} Caractères maximum`}
          placeholder="Ex: 5ml, 3 gouttes ..."
          onChange={(e) => setDosage(e.target.value)}
        />
      </Stack>
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
