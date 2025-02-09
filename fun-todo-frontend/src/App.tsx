
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/landing';
import PrivateRoute from "./components/PrivateRoute";
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
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<LandingPage  onGetStarted={() => {}} />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
