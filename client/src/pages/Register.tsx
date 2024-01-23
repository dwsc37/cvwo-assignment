import {
    Avatar,
    Button,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Credentials, Message } from "../interfaces/interfaces";
import { useRegisterMutation } from "../redux/api";

const Register = () => {
    const theme = useTheme();
    const [register] = useRegisterMutation();
    const navigate = useNavigate();
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

        const promise = register(credentials).unwrap();
        toast.promise(promise, {
            loading: "Registering...",
            success: (payload: Message) => {
                navigate("/login");
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
            <Avatar sx={{ backgroundColor: theme.palette.primary.main }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
                Register
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
                Register
            </Button>
            <Typography>
                Already have an account? <Link to="/login">Login here</Link>
            </Typography>
        </Paper>
    );
};

export default Register;
