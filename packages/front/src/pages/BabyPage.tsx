import { BottomNavigation, BottomNavigationAction, Container, Paper } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import RestoreIcon from '@mui/icons-material/Restore';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import SettingsIcon from '@mui/icons-material/Settings';
import { BabyTimeline } from '../components/BabyTimeline';
import { BabyRelation } from '../components/BabyRelation';
import { BabySettings } from '../components/BabySettings';

export const BabyPage = () => {
  const { babyId } = useParams();
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
