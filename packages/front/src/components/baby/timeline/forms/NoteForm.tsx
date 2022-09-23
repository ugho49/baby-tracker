import React, { useEffect, useMemo, useState } from 'react';
import { Note } from '@baby-tracker/common-types';
import { TextField } from '@mui/material';
import { FormProps } from '../BabyTimelineComponentDetails';
import { isBlank } from '../../../../utils';

const CONTENT_MAX_LENGTH = 500;

export const NoteForm = ({ onStateChange, onValidChange, disabled, initialState }: FormProps<Note>) => {
  const [content, setContent] = useState<string | undefined>(initialState?.content || '');

  const contentMaxLengthExceeded = useMemo(
    () => content !== undefined && content.length > CONTENT_MAX_LENGTH,
    [content]
  );

  useEffect(() => {
    const state: Note = { content: content || '' };
    onStateChange(state);
    onValidChange(!isBlank(content) && !contentMaxLengthExceeded);
  }, [onStateChange, onValidChange, content, contentMaxLengthExceeded]);

  return (
    <TextField
      label="Note"
      disabled={disabled}
      fullWidth
      multiline
      minRows={2}
      maxRows={15}
      value={content}
      placeholder="Ajouter une note"
      onChange={(e) => setContent(e.target.value)}
    />
  );
};
