import React, { useCallback, useEffect, useState } from 'react';
import { AddOrUpdateTimelineEntry, BabyWithUserAuthority, Meal } from '@baby-tracker/common-types';
import { Container, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { TimelineEntryFormDialog } from './TimelineEntryFormDialog';
import { babyTrackerApiRef, RootState } from '../../core';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '@baby-tracker/common-front';
import { setTimeline } from '../../core/store/features';
import { useInterval } from 'usehooks-ts';
import { DateTime } from 'luxon';
import Timeline from '@mui/lab/Timeline';
import {
  TimelineConnector,
  TimelineContent,
  timelineContentClasses,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator,
} from '@mui/lab';

const REFRESH_THRESHOLD_SECONDS = 5 * 60; // 5 minutes

export type BabyTimelineProps = {
  baby: BabyWithUserAuthority;
};

const mapState = (state: RootState) => ({
  timeline: state.baby.currentBaby?.timeline,
  refreshAt: state.baby.currentBaby?.timelineRefreshAt,
});

export const BabyTimeline = ({ baby }: BabyTimelineProps) => {
  const [timelineFormDialogOpen, setTimelineFormDialogOpen] = useState(false);
  const { timeline, refreshAt } = useSelector(mapState);
  const dispatch = useDispatch();
  const api = useApi(babyTrackerApiRef);

  function handleCreateTimelineEntry(entry: AddOrUpdateTimelineEntry) {
    // TODO: handle creation
    setTimelineFormDialogOpen(false);
  }

  const fetchTimeline = useCallback(() => {
    const needToFetch =
      !refreshAt || DateTime.fromISO(refreshAt).plus({ seconds: REFRESH_THRESHOLD_SECONDS }) < DateTime.now();
    if (!needToFetch) {
      return;
    }
    api.getBabyTimeline(baby.id, {}).then(({ data }) => dispatch(setTimeline(data)));
  }, [refreshAt]);

  useInterval(() => fetchTimeline(), 1_000);

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <>
      <Timeline
        sx={{
          padding: 0,
          [`& .${timelineOppositeContentClasses.root}`]: {
            m: 'auto 0',
            padding: '6px 10px',
            flex: 'none',
            width: '70px',
            textAlign: 'center',
          },
          [`& .${timelineContentClasses.root}`]: {
            flex: 'auto',
            py: '12px',
            px: 2,
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            <div style={{ fontWeight: 500 }}>
              {DateTime.now().minus({ hours: 13 }).toLocaleString(DateTime.TIME_SIMPLE)}
            </div>
            <div style={{ fontWeight: 300 }}>{DateTime.now().minus({ month: 10 }).toFormat('dd LLL')}</div>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <FastfoodIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Blakndklrtnghkdlnrtg
            </Typography>
            <Typography>Blakndkl rtnghkdlnrt sertregd</Typography>
          </TimelineContent>
        </TimelineItem>
        {(timeline?.entries || []).map((entry) => (
          <TimelineItem key={entry.id}>
            <TimelineOppositeContent variant="body2" color="text.secondary">
              <div style={{ fontWeight: 500 }}>
                {DateTime.fromISO(entry.occurred_at).toLocaleString(DateTime.TIME_SIMPLE)}
              </div>
              <div style={{ fontWeight: 300 }}>{DateTime.fromISO(entry.occurred_at).toFormat('dd LLL')}</div>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <FastfoodIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" component="span">
                {entry.type}
              </Typography>
              <Typography>{(entry.details as Meal).quantity}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
        <TimelineItem>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            <div style={{ fontWeight: 500 }}>{DateTime.now().toLocaleString(DateTime.TIME_SIMPLE)}</div>
            <div style={{ fontWeight: 300 }}>{DateTime.now().toFormat('dd LLL')}</div>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <FastfoodIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              hik
            </Typography>
            <Typography>hdddddd</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>

      <Fab
        sx={{ position: 'absolute', bottom: 72, right: 16 }}
        aria-label="Add"
        color="secondary"
        onClick={() => setTimelineFormDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <TimelineEntryFormDialog
        open={timelineFormDialogOpen}
        handleClose={() => setTimelineFormDialogOpen(false)}
        handleCreate={handleCreateTimelineEntry}
      />
    </>
  );
};
