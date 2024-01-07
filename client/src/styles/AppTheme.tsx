import { createTheme } from "@mui/material";

const primary = "#536DFE";
const secondary = "#FF5C93";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";

const AppTheme = createTheme({
  palette: {
    primary: {
      main: primary,
      
    },
    secondary: {
      main: secondary,
     
    },
    warning: {
      main: warning,
      
    },
    success: {
      main: success,
      
    },
    info: {
      main: info,
    
    },
    text: {
      primary: "#4A4A4A",
      secondary: "#6E6E6E",
    },
    background: {
      default: "#F6F7FF",
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Specify your font family here
  },
});
export default AppTheme