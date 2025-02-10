import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Divider,
  Link,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { authService } from '../services/authService';
import { authPageStyles } from '../styles/auth.styles';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required'),
});

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verificationSuccess = location.state?.verificationSuccess;
  const verificationMessage = location.state?.message;

  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    if (verificationSuccess) {
      setSubmitStatus({
        type: 'success',
        message: verificationMessage || 'Email verified successfully!'
      });
    }
  }, [verificationSuccess, verificationMessage]);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await authService.login(values);
        if (response.success) {
          setSubmitStatus({
            type: 'success',
            message: 'Login successful!',
          });
          // Redirect to dashboard or home page after successful login
          setTimeout(() => navigate('/dashboard'), 500);
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
          setTimeout(() => navigate('/dashboard'), 500);
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
          sx={authPageStyles.paper}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Login
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

              <FormControlLabel
                control={
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                    color="primary"
                  />
                }
                label="Remember me"
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
                  {formik.isSubmitting ? 'Logging in...' : 'Login'}
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
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register">
                      Register here
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
