import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Divider,
  Link
} from '@mui/material';
import { registerValidationSchema } from '../validations/authValidation';
import { authService } from '../services/authService';
import type { RegisterFormData } from '../types/auth';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import {  Link as RouterLink } from 'react-router-dom';
import { authPageStyles } from '../styles/auth.styles';

export const Register: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.register(values);
        if (response.success) {
          setSubmitStatus({
            type: 'success',
            message: 'Registration successful! Please check your email to verify your account.',
          });
          formik.resetForm();
        } else {
          setSubmitStatus({
            type: 'error',
            message: response.message,
          });
        }
      } catch (error) {
        console.log(error);
        setSubmitStatus({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async ({code}) => {
      try {
        const result = await authService.googleSignIn(code);
        if (result.success) {
          setSubmitStatus({
            type: 'success',
            message: 'Google sign-in successful!',
          });
        } else {
          setSubmitStatus({
            type: 'error',
            message: result.message,
          });
        }
      } catch (error) {
        console.log(error);
        setSubmitStatus({
          type: 'error',
          message: 'Failed to sign in with Google',
        });
      }
    },
    flow: 'auth-code',
    onError: () => {
      setSubmitStatus({
        type: 'error',
        message: 'Google sign-in failed',
      });
    },
  });

  return (
    <Box sx={authPageStyles.pageContainer}>
      <Container sx={authPageStyles.formContainer} maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={() => ({
            ...authPageStyles.paper,
            ...authPageStyles.registerPaper
          })}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Account
          </Typography>

          {submitStatus.type && (
            <Alert 
              severity={submitStatus.type} 
              sx={{ mb: 2 }}
              onClose={() => setSubmitStatus({ type: null, message: '' })}
            >
              {submitStatus.message}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit} style={{ flex: 1 }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  FormHelperTextProps={{
                    sx: {
                      position: 'absolute',
                      bottom: '-20px',
                      marginBottom: 0
                    }
                  }}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  FormHelperTextProps={{
                    sx: {
                      position: 'absolute',
                      bottom: '-20px',
                      marginBottom: 0
                    }
                  }}
                  sx={{ mb: 3 }}
                />
              </Box>

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                FormHelperTextProps={{
                  sx: {
                    position: 'absolute',
                    bottom: '-20px',
                    marginBottom: 0
                  }
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                FormHelperTextProps={{
                  sx: {
                    position: 'absolute',
                    bottom: '-20px',
                    marginBottom: 0
                  }
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                FormHelperTextProps={{
                  sx: {
                    position: 'absolute',
                    bottom: '-20px',
                    marginBottom: 0
                  }
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ mt: 'auto' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Divider sx={{ my: 2 }}>OR</Divider>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={() => googleLogin()}
                  startIcon={<GoogleIcon />}
                >
                  Continue with Google
                </Button>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login">
                      Login here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};
