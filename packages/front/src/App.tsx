import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Box, Container } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { ShowRoomPage } from './pages/ShowRoomPage';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '@baby-tracker/common-front';
import { babyTrackerApiRef, RootState } from './core';
import { useEffect } from 'react';
import { setBabies, setLoadBabies, setUser } from './core/store/features';
import { Navbar } from './components/Navbar';
import { BabyPage } from './pages/BabyPage';
import { RegisterBabyPage } from './pages/RegisterBabyPage';
import { UserProfilePage } from './pages/UserProfilePage';

const AnonymousRouteContainerOutlet = () => (
  <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Outlet />
    </Box>
  </Container>
);

const PrivateRouteContainerOutlet = () => (
  <>
    <Box
      id="backdrop"
      sx={{
        backgroundColor: '#f5f5f5',
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
    <Navbar />
    <Box component="main">
      <Outlet />
    </Box>
  </>
);

const mapState = (state: RootState) => ({ token: state.auth.token });

export const App = () => {
  const { token } = useSelector(mapState);
  const isLoggedIn = token !== undefined;
  const api = useApi(babyTrackerApiRef);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      api.getUserInfos().then((res) => dispatch(setUser(res.data)));
      dispatch(setLoadBabies(true));
      api
        .getAllMyBabies()
        .then((res) => dispatch(setBabies(res.data)))
        .finally(() => dispatch(setLoadBabies(false)));
    }
  }, [token]);

  return (
    <Routes>
      {!isLoggedIn && (
        <>
          <Route path="/" element={<ShowRoomPage />} />

          <Route element={<AnonymousRouteContainerOutlet />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </>
      )}

      {isLoggedIn && (
        <Route element={<PrivateRouteContainerOutlet />}>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="register-baby" element={<RegisterBabyPage />} />
          <Route path="baby/:babyId/*" element={<BabyPage />} />
        </Route>
      )}

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};
