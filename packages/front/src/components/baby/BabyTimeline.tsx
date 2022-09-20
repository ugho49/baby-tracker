import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BabyWithUserAuthority } from '@baby-tracker/common-types';
import { Box, Button, Chip, Fab } from '@mui/material';
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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const REFRESH_THRESHOLD_SECONDS = 5 * 60; // 5 minutes

const sortOccurredDateAsc = (a: any, b: any): number => {
  const [dayA] = a;
  const [dayB] = b;
  return DateTime.fromISO(dayA).toMillis() - DateTime.fromISO(dayB).toMillis();
};

const sortOccurredDateDesc = (a: any, b: any): number => {
  const [dayA] = a;
  const [dayB] = b;
  return DateTime.fromISO(dayB).toMillis() - DateTime.fromISO(dayA).toMillis();
};

export type BabyTimelineProps = {
  baby: BabyWithUserAuthority;
};

const mapState = (state: RootState) => ({
  timelineEntries: state.baby.currentBaby?.timelineEntries || {},
  loadedDays: state.baby.currentBaby?.timelineLoadedDays || [],
  availableDays: state.baby.currentBaby?.timelineAvailableDays || [],
  refreshAt: state.baby.currentBaby?.timelineRefreshAt,
});

export const BabyTimeline = ({ baby }: BabyTimelineProps) => {
  const [timelineFormDialogOpen, setTimelineFormDialogOpen] = useState(false);
  const { timelineEntries, refreshAt, loadedDays, availableDays } = useSelector(mapState);
  const dispatch = useDispatch();
  const api = useApi(babyTrackerApiRef);

  const fetchTimeline = useCallback(async () => {
    const needToFetch =
      !refreshAt || DateTime.fromISO(refreshAt).plus({ seconds: REFRESH_THRESHOLD_SECONDS }) < DateTime.now();
    if (!needToFetch) {
      return;
    }
    try {
      const { data } = await api.getBabyTimeline(baby.id, {});
      dispatch(setTimeline(data));
    } catch (e) {
      dispatch(timelineRefreshed());
    }
  }, [refreshAt]);

  useInterval(() => fetchTimeline(), 1_000);

  useEffect(() => {
    fetchTimeline().then(() => window.scrollTo({ left: 0, top: document.body.scrollHeight }));
  }, []);

  const previousDay = useMemo(() => {
    if (loadedDays.length === availableDays.length) {
      return undefined;
    }
    return availableDays.filter((d) => !loadedDays.includes(d))[0];
  }, [loadedDays, availableDays]);

  const loadPrevious = useCallback(async () => {
    try {
      const { data } = await api.getBabyTimeline(baby.id, {
        day: previousDay,
      });
      dispatch(setTimeline(data));
    } catch (e) {
      console.error(e); // TODO: handle error
    }
  }, [previousDay]);

  return (
    <>
      {previousDay && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            fullWidth
            onClick={() => loadPrevious()}
            variant="text"
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <KeyboardArrowUpIcon />
            <span>Voir le jour précédent</span>
          </Button>
        </Box>
      )}
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
        {Object.entries(timelineEntries)
          .sort(sortOccurredDateAsc)
          .map(([day, entries]) => (
            <React.Fragment key={day}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip
                  sx={{ margin: '10px', padding: '5px 60px' }}
                  label={DateTime.fromISO(day).toLocaleString(DateTime.DATE_MED)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              {entries.map((entry, i) => (
                <BabyTimelineEntry
                  key={entry.id}
                  babyId={baby.id}
                  authority={baby.relation.authority}
                  entry={entry}
                  first={i === 0}
                  last={i + 1 === entries.length}
                />
              ))}
            </React.Fragment>
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
