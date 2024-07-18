
import { createTheme } from '@mui/material/styles';

// alienware + the matrix
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#76ff03',
      main: '#64dd17',
      dark: '#338a3e',
      contrastText: '#000000',
    },
    secondary: {
      light: '#66bb6a',
      main: '#43a047',
      dark: '#00701a',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    error: {
      light: '#e57373',
      main: '#d32f2f',
      dark: '#b71c1c',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
