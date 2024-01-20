import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const handleBackToHome = () => {
        navigate("/home");
    };

    return (
        <div>
            <Typography variant="h4">Oops! Something went wrong.</Typography>
            <Typography variant="body1">
                We apologize for the inconvenience. The page you're looking for
                couldn't be loaded.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBackToHome}
            >
                Back to Home
            </Button>
        </div>
    );
};

export default ErrorPage;
