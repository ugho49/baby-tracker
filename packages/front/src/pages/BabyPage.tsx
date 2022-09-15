import { BottomNavigation, BottomNavigationAction, Box, Container, Paper, Tab, Tabs, tabsClasses } from '@mui/material';
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
import { useSelector } from 'react-redux';

const mapState = (state: RootState) => ({ babies: state.baby.babies });

export const BabyPage = () => {
  const { babyId } = useParams();
  const { babies } = useSelector(mapState);
  const basePath = useMemo(() => `/baby/${babyId}`, [babyId]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`${basePath}/${newValue}`);
    setValue(newValue);
  };

  useEffect(() => {
    const { pathname } = location;
    const nestedPath = pathname.replace(basePath, '').replace('/', '');
    setValue(nestedPath);
  }, [location, basePath]);

  return (
    <div>
      <Paper elevation={3}>
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
              label={`${baby.firstname} ${baby.lastname[0]}`}
              value={baby.id}
              onClick={() => navigate(`/baby/${baby.id}`)}
            />
          ))}
        </Tabs>
      </Paper>
      <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
        <Routes>
          <Route path="timeline" element={<BabyTimeline />} />
          <Route path="relations" element={<BabyRelation />} />
          <Route path="settings" element={<BabySettings />} />
          <Route path="*" element={<Navigate replace to="timeline" />} />
        </Routes>
      </Container>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction label="Timeline" value="timeline" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Relations" value="relations" icon={<EscalatorWarningIcon />} />
          <BottomNavigationAction label="Settings" value="settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </div>
  );
};
