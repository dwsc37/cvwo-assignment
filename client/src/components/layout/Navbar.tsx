import ForumIcon from "@mui/icons-material/Forum";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import {
    AppBar,
    Box,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "../../interfaces/interfaces";
import { useLogoutMutation, useValidateQuery } from "../../redux/api";
const Navbar = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useValidateQuery();
    const [showBar, setShowBar] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [logout] = useLogoutMutation();
    const handleLogout = (event: React.MouseEvent) => {
        event.preventDefault();
        handleCloseUserMenu();
        const promise = logout().unwrap();
        toast.promise(promise, {
            loading: "Logging out...",
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
    useEffect(() => {
        if (!isLoading) {
            if (data) setShowBar(true);
            else setShowBar(false);
        }
    }, [data, isLoading, error]);

    return (
        <AppBar sx={{ zIndex: 2 }}>
            <Toolbar>
                <Box
                    onClick={() => {
                        if (data) navigate("/home");
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        ":hover": { cursor: data ? "pointer" : "auto" },
                    }}
                >
                    <ForumIcon
                        sx={{ marginRight: 1, ":hover": { cursor: "pointer" } }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ fontFamily: "Papyrus", letterSpacing: ".2rem" }}
                    >
                        modulo
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}></Box>
                {showBar && (
                    <>
                        <Box
                            sx={{
                                flexGrow: 0,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Tooltip title="User">
                                <IconButton
                                    sx={{ color: "inherit" }}
                                    onClick={handleOpenUserMenu}
                                >
                                    <PersonIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography>User : {data?.message}</Typography>
                            <Menu
                                sx={{ marginTop: "5px" }}
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem
                                    component={Link}
                                    to={"/profile/" + data?.message}
                                    onClick={handleCloseUserMenu}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Profile" />
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </MenuItem>
                            </Menu>
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
