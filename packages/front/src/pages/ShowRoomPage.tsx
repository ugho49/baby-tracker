import React from 'react';
import { RouterLink } from '@baby-tracker/common-front';

export const ShowRoomPage = () => {
  return (
    <div>
      ShowRoomPage this is a showroom of BabyTracker
      <br />
      <RouterLink to="/login">Log in</RouterLink>
      <br />
      <RouterLink to="/register">Register</RouterLink>
    </div>
  );
};
