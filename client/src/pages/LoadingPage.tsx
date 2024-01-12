import { useTheme } from "@mui/material";
import ReactLoading from "react-loading";

const LoadingPage = () => {
  const theme = useTheme();
  return (
      <div>
        <ReactLoading type="spin" color={theme.palette.primary.main}/>
      </div>
  );
};

export default LoadingPage;