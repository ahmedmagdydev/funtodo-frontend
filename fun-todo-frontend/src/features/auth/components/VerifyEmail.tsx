import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import { authService } from '../../../api/auth';
import { ApiResponse } from '../../../shared/types/api';

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
        const response: ApiResponse = await authService.verifyEmail(token);
        
        if (response.success) {
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
