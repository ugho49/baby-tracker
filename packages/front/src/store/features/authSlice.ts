import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user?: { id: string; email: string };
  token?: string;
}

const initialState: AuthState = {
  user: undefined, // TODO -> jwtService.getUserInfoFromToken(),
  token: undefined, // TODO -> jwtService.getTokenFromLocalStorage(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      // TODO -> jwtService.storeTokenInLocalStorage(token);
      state.token = token;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      // TODO -> jwtService.removeTokenFromLocalStorage();
      state.user = undefined;
      state.token = undefined;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
