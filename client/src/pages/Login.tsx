import LoginIcon from "@mui/icons-material/Login";
import {
    Avatar,
    Button,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Credentials, Message } from "../interfaces/interaces";
import { useLoginMutation } from "../redux/api";

const Login = () => {
    const theme = useTheme();
    const [login] = useLoginMutation();
    const [credentials, setCredentials] = useState<Credentials>({
        Username: "",
        Password: "",
    });

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            Username: event.target.value,
        }));
    };
    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            Password: event.target.value,
        }));
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const promise = login(credentials).unwrap();
        toast.promise(promise, {
            loading: "Logging in...",
            success: (payload: Message) => {
                return payload.message;
            },
            error: (payload) => {
                try {
                    return payload.data.error;
                } catch {
                    return "Error, something went wrong!";
                }
            },
        });
    };
    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={10}
            sx={{
                padding: "20px",
                width: "20%",
                minWidth: "200px",
                margin: "20px auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
                gap: "10px",
            }}
        >
            <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
                <LoginIcon />
            </Avatar>
            <Typography variant="h3" gutterBottom fontWeight="bold">
                Login
            </Typography>
            <TextField
                label="Username"
                placeholder="Enter username"
                value={credentials.Username}
                onChange={handleUsernameChange}
                fullWidth
                required
            />
            <TextField
                label="Password"
                placeholder="Enter password"
                type="password"
                value={credentials.Password}
                onChange={handlePasswordChange}
                fullWidth
                required
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ fontWeight: "bold", fontSize: 18 }}
            >
                Login
            </Button>
            <Typography>
                New user? <Link to="/register">Register here</Link>
            </Typography>
        </Paper>
    );
};

export default Login;
