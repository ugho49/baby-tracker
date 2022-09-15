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
import { setUser } from './core/store/features';
import { Navbar } from './components/Navbar';

const AnonymousRouteContainerOutlet = () => (
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
);

const PrivateRouteContainerOutlet = () => (
  // <main className="content">
  <>
    <Navbar />
    <Outlet />
  </>
  //   <Menu />
  // </main>
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
    }
  }, [token]);

  return (
    <Container component="main" maxWidth="xs">
      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/" element={<ShowRoomPage />} />

            <Route element={<AnonymousRouteContainerOutlet />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </>
        )}

        {isLoggedIn && (
          <Route element={<PrivateRouteContainerOutlet />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
          </Route>
        )}

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Container>
  );
};
