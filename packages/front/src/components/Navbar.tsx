import React from 'react';
import { logout } from '../core/store/features';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

export const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // TODO: Toast "Hope to see you soon"
    dispatch(logout());
  };

  return (
    <div>
      <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};
