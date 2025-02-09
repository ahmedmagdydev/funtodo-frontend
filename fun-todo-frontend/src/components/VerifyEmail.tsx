import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import axios from 'axios';

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Verification token is missing');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`);
        
        if (response.data.success) {
          // Show success message and redirect to login
          navigate('/login', { 
            state: { 
              verificationSuccess: true,
              message: 'Your email has been verified. Please login now.'
            }
          });
        } else {
          setError('Email verification failed. Please try again.');
        }
      } catch (error) {
        setError('Email verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="h6" align="center">
          Verifying your email...
        </Typography>
      </Box>
    </Container>
  );
};
