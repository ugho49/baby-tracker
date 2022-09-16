import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@baby-tracker/common-types';
import { AuthService } from '../../services/auth.service';

const authService = new AuthService();

export interface AuthState {
  user?: User;
  token?: string;
}

const initialState: AuthState = {
  user: undefined,
  token: authService.getAccessTokenFromLocalStorage(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      authService.storeAccessTokenInLocalStorage(token);
      state.token = token;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    resetAuthState: (state) => {
      authService.removeAccessToken();
      state.user = undefined;
      state.token = undefined;
    },
  },
});

export const { setToken, setUser, resetAuthState } = authSlice.actions;
