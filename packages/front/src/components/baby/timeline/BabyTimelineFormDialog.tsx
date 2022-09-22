import React, { FormEvent, forwardRef, useState } from 'react';
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  IconButton,
  Slide,
  Stack,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionProps } from '@mui/material/transitions';
import { BabyTimelineType } from '@baby-tracker/common-types';
import { BabyTimelineComponentDetails } from './BabyTimelineComponentDetails';
import { MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { makeStyles } from '@mui/styles';
import { useApi } from '@baby-tracker/common-front';
import { babyTrackerApiRef } from '../../../core';
import { BabyTimelineTypeForm } from './BabyTimelineComponentForms';
import { useDispatch } from 'react-redux';
import { addTimelineEntry, deleteTimelineEntry, editTimelineEntry } from '../../../core/store/features';
import { sleep } from '../../../utils';

const Transition = forwardRef((props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerBullet: {
    background: theme.palette.secondary.main,
    color: '#ffffff',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    textAlign: 'center',
    lineHeight: 1.6,
    fontWeight: 600,
  },
  headerText: {
    fontWeight: 600,
  },
}));

type EditStateProps = {
  id: string;
  type: BabyTimelineType;
  details: unknown;
  occurredAt: DateTime;
};

type ModeProps<T> = T extends 'create'
  ? { mode: 'create'; editState?: never }
  : T extends 'edit'
  ? { mode: 'edit'; editState: EditStateProps }
  : never;

export type TimelineFormDialogProps = (ModeProps<'create'> | ModeProps<'edit'>) & {
  babyId: string;
  open: boolean;
  handleClose: () => void;
};

export const BabyTimelineFormDialog = ({ babyId, open, handleClose, mode, editState }: TimelineFormDialogProps) => {
  const classes = useStyles();
  const api = useApi(babyTrackerApiRef);
  const [timelineType, setTimelineType] = useState<BabyTimelineType | undefined>(editState?.type);
  const [occurredAt, setOccurredAt] = useState<DateTime | null>(editState?.occurredAt || DateTime.now());
  const [typeFormState, setTypeFormState] = useState<unknown>(editState?.details);
  const [typeFormIsValid, setTypeFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const resetForm = () => {
    setTimelineType(undefined);
    setOccurredAt(DateTime.now());
    setTypeFormState(undefined);
    setTypeFormIsValid(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!timelineType || !occurredAt) {
        throw new Error('Missing properties');
      }

      if (mode === 'create') {
        const { data } = await api.addBabyTimeline(babyId, {
          type: timelineType,
          details: typeFormState,
          occurredAt: occurredAt.toISO(),
        });
        dispatch(addTimelineEntry(data));
        resetForm();
      }

      if (mode === 'edit') {
        const { data } = await api.updateBabyTimeline(babyId, editState.id, {
          type: timelineType,
          details: typeFormState,
          occurredAt: occurredAt.toISO(),
        });
        dispatch(editTimelineEntry(data));
      }

      handleClose();
    } catch (e) {
      console.error(e); // TODO handle error properly
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async () => {
    if (mode !== 'edit') {
      return;
    }
    try {
      setLoading(true);
      await api.deleteBabyTimeline(babyId, editState.id);
      handleClose();
      await sleep(300);
      dispatch(deleteTimelineEntry(editState.id));
    } catch (e) {
      setLoading(false);
      console.error(e); // TODO handle error properly
    }
  };

  const changeDatetime = (date: DateTime | null) => {
    if (date && date.toMillis() > DateTime.now().toMillis()) {
      setOccurredAt(DateTime.now());
      return;
    }
    setOccurredAt(date);
  };

  const changeTimelineType = (type: string | null) => {
    setTypeFormState({});
    setTypeFormIsValid(false);
    setTimelineType(type ? (type as BabyTimelineType) : undefined);
  };

  const formIsValid = typeFormIsValid && occurredAt !== null && timelineType !== undefined;

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" disabled={loading} onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {mode === 'create' ? 'Ajouter un évènement' : "Editer l'évènement"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <Box sx={{ mb: 3 }} className={classes.header}>
            <span className={classes.headerBullet}>1</span>
            <Typography className={classes.headerText}>Date & Type</Typography>
          </Box>
          <Stack sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
            <MobileDatePicker
              label="Date de l'évènement"
              inputFormat="dd LLL yyyy"
              value={occurredAt}
              disabled={loading}
              onChange={(date) => changeDatetime(date)}
              disableFuture={true}
              renderInput={(params) => <TextField {...params} />}
            />
            <MobileTimePicker
              label="Heure de l'évènement"
              inputFormat="HH:mm"
              disabled={loading}
              value={occurredAt}
              onChange={(date) => changeDatetime(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
          {mode === 'create' && (
            <Autocomplete
              fullWidth
              disabled={loading}
              sx={{ mb: 2 }}
              options={Object.keys(BabyTimelineComponentDetails)}
              getOptionLabel={(type: string) => BabyTimelineComponentDetails[type as BabyTimelineType].label}
              onChange={(_, type) => changeTimelineType(type)}
              renderOption={(props, type) => {
                const { icon, color, label } = BabyTimelineComponentDetails[type as BabyTimelineType];

                return (
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props}>
                    <Box sx={{ mr: 3, color }}>{icon}</Box>
                    <Box>{label}</Box>
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="Type de l'évènement" inputProps={{ ...params.inputProps }} />
              )}
            />
          )}

          <Box sx={{ mt: 4, mb: 3 }} className={classes.header}>
            <span className={classes.headerBullet}>2</span>
            <Typography className={classes.headerText}>Détails</Typography>
          </Box>

          {!timelineType && (
            <Typography variant="caption">Veuillez choisir un type afin de remplir les détails</Typography>
          )}

          {timelineType && (
            <BabyTimelineTypeForm
              type={timelineType}
              initialState={typeFormState}
              occurredAt={occurredAt}
              onStateChange={setTypeFormState}
              onValidChange={setTypeFormIsValid}
              disabled={loading}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            aria-label="save"
            disabled={loading || !formIsValid}
            startIcon={<SaveIcon />}
          >
            {mode === 'create' ? 'Créer' : 'Editer'}
          </Button>
          {mode === 'edit' && (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 5 }}
              aria-label="delete"
              disabled={loading}
              startIcon={<DeleteIcon />}
              onClick={() => deleteEntry()}
            >
              Supprimer
            </Button>
          )}
        </Box>
      </Container>
    </Dialog>
  );
};
