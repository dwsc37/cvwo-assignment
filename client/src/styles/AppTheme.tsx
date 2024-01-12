import { createTheme } from "@mui/material";

const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      
    },
    secondary: {
      main: "#f50057",
     
    },
    background: {
      default: "#F6F7FF",
      paper: "#E8EAF6",
    },
  },
  typography: {
    fontFamily: "Papyrus",
  },
});
export default AppTheme