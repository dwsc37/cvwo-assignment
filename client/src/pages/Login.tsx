import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Button, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from '../redux/api';
import { Credentials, Message } from '../interfaces/interaces';


const Login = () => {
    const theme = useTheme();
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<Credentials>({
        username: "",
        password: "",
    });

    const handleUsernameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            username: event.target.value,
        }));
    }
    const handlePasswordChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            password: event.target.value,
        }));
    }   
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        const promise = login(credentials).unwrap();
        toast.promise(promise, {
            loading: "Logging in...",
            success: (payload : Message) =>{
                navigate("/register");
                return payload.message;
            },
            error: (payload) =>{
                try{
                    return payload.data.error;
                }
                catch{
                    return "Error";
                } 
            }, 
        });
    }
    return (    
        <Paper
            component="form" 
            onSubmit={handleSubmit}  
            elevation={10} 
            sx={{
                backgroundColor: theme.palette.background.default,
                padding: "20px",
                width: "20%",
                minWidth: "200px",
                margin: "20px auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyItems: "center",
                gap: "10px"
        }}>
            <Avatar sx={{
                backgroundColor: theme.palette.primary.main,
            }}><LoginIcon /></Avatar>
            <Typography variant="h3"gutterBottom sx={{
                color: theme.palette.text.primary,
                fontWeight: "bold"
            }}>
                Login
            </Typography>
            <TextField label="Username" placeholder="Enter username" value={credentials.username} onChange={handleUsernameChange} fullWidth required/>
            <TextField label="Password" placeholder="Enter password" type="password" value={credentials.password} onChange={handlePasswordChange} fullWidth required/>
            <Button type="submit" variant="contained" fullWidth sx={{
                backgroundColor: theme.palette.primary.main,
            }}>
                Login
            </Button>
            <Typography>
                New user? <Link to="/register">Register here
                </Link>
            </Typography>
        </Paper>
    )
}

export default Login