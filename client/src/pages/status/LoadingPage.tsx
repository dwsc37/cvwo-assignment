import { Box, useTheme } from "@mui/material";
import ReactLoading from "react-loading";

const LoadingPage = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
            }}
        >
            <ReactLoading type="spin" color={theme.palette.primary.main} />
        </Box>
    );
};

export default LoadingPage;
