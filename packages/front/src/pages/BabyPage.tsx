import {
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Container,
  Paper,
  Tab,
  Tabs,
  tabsClasses,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { BabyTimeline } from '../components/baby/BabyTimeline';
import { BabyRelation } from '../components/baby/BabyRelation';
import { BabySettings } from '../components/baby/BabySettings';
import { RootState } from '../core';
import { useDispatch, useSelector } from 'react-redux';
import { resetCurrentBaby, setCurrentBaby } from '../core/store/features';

const mapState = (state: RootState) => ({ babies: state.baby.babies, currentBaby: state.baby.currentBaby });

export const BabyPage = () => {
  const { babyId } = useParams();
  const { babies, currentBaby } = useSelector(mapState);
  const basePath = useMemo(() => `/baby/${babyId}`, [babyId]);
  const [currentNavigation, setCurrentNavigation] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`${basePath}/${newValue}`);
    setCurrentNavigation(newValue);
  };

  useEffect(() => {
    const { pathname } = location;
    const nestedPath = pathname.replace(basePath, '').replace('/', '');
    setCurrentNavigation(nestedPath);
  }, [location, basePath]);

  useEffect(() => {
    const currentBaby = babies?.find((baby) => baby.id === babyId);
    if (currentBaby) {
      dispatch(setCurrentBaby(currentBaby));
    }
  }, [babyId, babies]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentBaby());
    };
  }, []);

  if (!currentBaby) {
    return (
      <Container
        component="main"
        sx={{
          mt: 2,
          display: 'flex',
          width: '100%',
          height: 'calc(100vh - 60px)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div>
      <Paper elevation={3} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <Tabs
          value={babyId}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="visible arrows tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          <Tab icon={<PersonAddIcon />} iconPosition="start" onClick={() => navigate('/register-baby')} />

          {(babies || []).map((baby) => (
            <Tab
              key={baby.id}
              label={`${baby.firstname} ${baby.lastname[0]}`}
              value={baby.id}
              onClick={() => navigate(`/baby/${baby.id}`)}
            />
          ))}
        </Tabs>
      </Paper>
      <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
        <Routes>
          <Route path="timeline" element={<BabyTimeline baby={currentBaby} />} />
          <Route path="relations" element={<BabyRelation baby={currentBaby} />} />
          <Route path="settings" element={<BabySettings baby={currentBaby} />} />
          <Route path="*" element={<Navigate replace to="timeline" />} />
        </Routes>
      </Container>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={currentNavigation} onChange={handleChange}>
          <BottomNavigationAction label="Timeline" value="timeline" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Relations" value="relations" icon={<EscalatorWarningIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
};
