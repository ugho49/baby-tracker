import { Dispatch } from '@reduxjs/toolkit';
import { resetAuthState } from './authSlice';
import { resetBabyState } from './babySlice';

export * from './authSlice';
export * from './babySlice';

export const logout = (dispatch: Dispatch) => {
  dispatch(resetAuthState());
  dispatch(resetBabyState());
};
