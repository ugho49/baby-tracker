import { Avatar, Box, Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { RouterLink, useApi } from '@baby-tracker/common-front';
import { babyTrackerApiRef } from '../core';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Login } from '@baby-tracker/common-types';
import { setToken } from '../core/store/features';

export const LoginPage = () => {
  const api = useApi(babyTrackerApiRef);
  const dispatch = useDispatch();
  const [form, setForm] = useState<Login>({ email: '', password: '' });

  async function onSubmit(e: any) {
    e.preventDefault();
    try {
      const { data } = await api.login(form);
      dispatch(setToken(data.access_token));
    } catch (e) {
      // TODO handle errors
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          type="email"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <RouterLink to="#" variant="body2">
              Forgot password?
            </RouterLink>
          </Grid>
          <Grid item>
            <RouterLink to="#" variant="body2">
              "Don't have an account? Sign Up"
            </RouterLink>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
