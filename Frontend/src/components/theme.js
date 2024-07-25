import { createTheme } from "@mui/material/styles";

// alienware + the matrix
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#76ff03",
      main: "#64dd17",
      dark: "#338a3e",
      contrastText: "#000000",
    },
    secondary: {
      light: "#66bb6a",
      main: "#43a047",
      dark: "#00701a",
      contrastText: "#000000",
    },
    background: {
      default: "#1E1E1E",
      paper: "#2C2C2C ",
    },
    error: {
      light: "#e57373",
      main: "#d32f2f",
      dark: "#b71c1c",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          transition: background-color 0.4s ease, color 0.4s ease;
        }
      `,
    },
  }
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: '#76ff03',
      main: '#64dd17',
      dark: '#338a3e',
      contrastText: '#000000', // Primary text color
    },
    secondary: {
      light: '#66bb6a',
      main: '#43a047',
      dark: '#00701a',
      contrastText: '#000000', // Secondary text color
    },
    background: {
      default: '#F0F0F0', // Light gray background
      paper: '#E0E0E0', // Paper background slightly darker for contrast
    },
    text: {
      primary: '#000000', // Primary text color in light mode
      secondary: '#333333', // Secondary text color if needed
    },
    error: {
      light: '#e57373',
      main: '#d32f2f',
      dark: '#b71c1c',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          transition: background-color 0.4s ease, color 0.4s ease;
        }
      `,
    },
  }
});

export { darkTheme, lightTheme };
