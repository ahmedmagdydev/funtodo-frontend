import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Register } from './features/auth/components/Register';
import { Login } from './features/auth/components/Login';
import { VerifyEmail } from './features/auth/components/VerifyEmail';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { LandingPage } from './features/landing/components/landing';
import PrivateRoute from "./shared/components/PrivateRoute";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<LandingPage   />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
