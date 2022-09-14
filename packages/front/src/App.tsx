import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Box, Container } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { ShowRoomPage } from './pages/ShowRoomPage';

export type AppProps = {};

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
  //   <Navbar />
  <Outlet />
  //   <Menu />
  // </main>
);

export const App = (props: AppProps) => {
  const isLoggedIn = false;

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
