import { useSelector } from 'react-redux';
import { RootState } from '../core';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, Avatar, Box, Button, Card, CardContent, Container, TextField } from '@mui/material';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const mapState = (state: RootState) => ({ babies: state.baby.babies });

export const HomePage = () => {
  const { babies } = useSelector(mapState);
  const [babyId, setBabyId] = useState('');
  const navigate = useNavigate();

  const chooseBaby = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/baby/${babyId}`);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 12 }}>
        <Card sx={{ width: '100%', p: 3 }}>
          <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ mb: 2, bgcolor: 'secondary.main', width: '60px', height: '60px' }}>
              <ChildFriendlyIcon />
            </Avatar>
            <Box component="form" onSubmit={chooseBaby}>
              <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                options={babies || []}
                getOptionLabel={(baby) => `${baby.firstname} ${baby.lastname}`}
                onChange={(_, baby) => setBabyId(baby?.id || '')}
                renderOption={(props, baby) => (
                  <Box component="li" {...props}>
                    {baby.gender === 'BOY' && <MaleIcon />}
                    {baby.gender === 'GIRL' && <FemaleIcon />}
                    &nbsp;
                    <span>
                      {baby.firstname} {baby.lastname}
                    </span>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Choisir un bébé" inputProps={{ ...params.inputProps }} />
                )}
              />
              <Button type="submit" disabled={babyId === ''} fullWidth variant="contained" sx={{ mt: 3 }}>
                Valider
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
