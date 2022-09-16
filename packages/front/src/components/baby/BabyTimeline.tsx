import React, { useCallback, useEffect, useState } from 'react';
import { BabyWithUserAuthority } from '@baby-tracker/common-types';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { BabyTimelineFormDialog } from './timeline/BabyTimelineFormDialog';
import { babyTrackerApiRef, RootState } from '../../core';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '@baby-tracker/common-front';
import { setTimeline, timelineRefreshed } from '../../core/store/features';
import { useInterval } from 'usehooks-ts';
import { DateTime } from 'luxon';
import Timeline from '@mui/lab/Timeline';
import { timelineContentClasses, timelineOppositeContentClasses } from '@mui/lab';
import { BabyTimelineEntry } from './timeline/BabyTimelineEntry';

const REFRESH_THRESHOLD_SECONDS = 5 * 60; // 5 minutes

export type BabyTimelineProps = {
  baby: BabyWithUserAuthority;
};

const mapState = (state: RootState) => ({
  timelineEntries: state.baby.currentBaby?.timelineEntries || [],
  refreshAt: state.baby.currentBaby?.timelineRefreshAt,
});

export const BabyTimeline = ({ baby }: BabyTimelineProps) => {
  const [timelineFormDialogOpen, setTimelineFormDialogOpen] = useState(false);
  const { timelineEntries, refreshAt } = useSelector(mapState);
  const dispatch = useDispatch();
  const api = useApi(babyTrackerApiRef);

  const fetchTimeline = useCallback(async () => {
    const needToFetch =
      !refreshAt || DateTime.fromISO(refreshAt).plus({ seconds: REFRESH_THRESHOLD_SECONDS }) < DateTime.now();
    if (!needToFetch) {
      return;
    }
    try {
      const { data } = await api.getBabyTimeline(baby.id, {
        // type: BabyTimelineType.NOTE,
        // order: 'asc',
        // day: DateTime.now().minus({ day: 3 }).toISODate(),
      });
      dispatch(setTimeline(data));
    } catch (e) {
      dispatch(timelineRefreshed());
    }
  }, [refreshAt]);

  useInterval(() => fetchTimeline(), 1_000);

  useEffect(() => {
    fetchTimeline();
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [timelineEntries]);

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
        {timelineEntries.map((entry, i, entries) => (
          <BabyTimelineEntry
            key={entry.id}
            babyId={baby.id}
            authority={baby.relation.authority}
            entry={entry}
            first={i === 0}
            last={i + 1 === entries.length}
          />
        ))}
      </Timeline>

      <Fab
        sx={{ position: 'fixed', bottom: 72, right: 16 }}
        aria-label="Add"
        color="secondary"
        onClick={() => setTimelineFormDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <BabyTimelineFormDialog
        babyId={baby.id}
        open={timelineFormDialogOpen}
        mode="create"
        handleClose={() => setTimelineFormDialogOpen(false)}
      />
    </>
  );
};
