import React, { forwardRef } from 'react';
import { AppBar, Button, Container, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { AddOrUpdateTimelineEntry } from '@baby-tracker/common-types';
import { TransitionProps } from '@mui/material/transitions';

export type TimelineEntryFormDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleCreate: (entry: AddOrUpdateTimelineEntry) => void;
};

const Transition = forwardRef((props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const TimelineEntryFormDialog = ({ open, handleCreate, handleClose }: TimelineEntryFormDialogProps) => {
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Sound
          </Typography>
          <Button
            autoFocus
            color="inherit"
            onClick={() => handleCreate({} as AddOrUpdateTimelineEntry)} // TODO CHANGE THIS
            aria-label="save"
            disabled={false} // TODO: disable if entry is not valid
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Container>Hello world</Container>
    </Dialog>
  );
};
