import React, { useState } from 'react';
import { BabyAuthority, BabyTimelineEntry as BabyTimelineEntryType, hasAuthority } from '@baby-tracker/common-types';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { DateTime } from 'luxon';
import { Typography } from '@mui/material';
import { BabyTimelineComponentDetails } from './BabyTimelineComponentDetails';
import { makeStyles } from '@mui/styles';
import { BabyTimelineFormDialog } from './BabyTimelineFormDialog';

const useStyles = makeStyles({
  item: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#eeeeee',
      borderRadius: '10px',
    },
  },
});

export type BabyTimelineEntryProps = {
  babyId: string;
  authority: BabyAuthority;
  entry: BabyTimelineEntryType;
  first: boolean;
  last: boolean;
};

const transparent: SxProps<Theme> = { backgroundColor: 'transparent' };

export const BabyTimelineEntry = ({ babyId, authority, entry, first, last }: BabyTimelineEntryProps) => {
  const [timelineFormDialogOpen, setTimelineFormDialogOpen] = useState(false);
  const classes = useStyles();
  const componentsDetails = BabyTimelineComponentDetails[entry.type];

  return (
    <>
      <TimelineItem
        className={classes.item}
        onClick={
          hasAuthority(BabyAuthority.ROLE_WRITE_USER, authority) ? () => setTimelineFormDialogOpen(true) : undefined
        }
      >
        <TimelineOppositeContent variant="body2" color="text.secondary">
          <div style={{ fontWeight: 500 }}>
            {DateTime.fromISO(entry.occurred_at).toLocaleString(DateTime.TIME_SIMPLE)}
          </div>
          {/*<div style={{ fontWeight: 300 }}>{DateTime.fromISO(entry.occurred_at).toFormat('dd LLL')}</div>*/}
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineConnector sx={first ? transparent : undefined} />
          <TimelineDot sx={{ backgroundColor: componentsDetails.color }}>{componentsDetails.icon}</TimelineDot>
          <TimelineConnector sx={last ? transparent : undefined} />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="h6" component="div">
            {componentsDetails.label}
          </Typography>
          <Typography>{componentsDetails.computeDescription(entry.details)}</Typography>
        </TimelineContent>
      </TimelineItem>
      <BabyTimelineFormDialog
        mode="edit"
        babyId={babyId}
        open={timelineFormDialogOpen}
        handleClose={() => setTimelineFormDialogOpen(false)}
        editState={{
          id: entry.id,
          type: entry.type,
          details: entry.details,
          occurredAt: DateTime.fromISO(entry.occurred_at),
        }}
      />
    </>
  );
};
