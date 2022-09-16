import { useSelector } from 'react-redux';
import { RootState } from '../core';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container } from '@mui/material';

const mapState = (state: RootState) => ({ babies: state.baby.babies || [], loadBabies: state.baby.loadBabies });

export const HomePage = () => {
  const { babies, loadBabies } = useSelector(mapState);
  const navigate = useNavigate();

  useEffect(() => {
    if (loadBabies === false) {
      if (babies.length === 0) {
        navigate('/register-baby');
      } else {
        navigate(`/baby/${babies[0].id}`);
      }
    }
  }, [babies, loadBabies, navigate]);

  return (
    <Container
      component="article"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: 'calc(100vh - 60px)',
      }}
    >
      <CircularProgress />
    </Container>
  );
};
