import CreateIcon from '@mui/icons-material/Create';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { AppBar, Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Message } from "../../interfaces/interaces";
import { useLogoutMutation, useValidateQuery } from "../../redux/api";
const Navbar = () => {
    const {data, isLoading, error} = useValidateQuery();
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
            success: (payload : Message) =>{
                return payload.message;
            },
            error: (payload) =>{
                try{
                    return payload.data.error;
                }
                catch{
                    return "Error, something went wrong!";
                } 
            }, 
        },{id: "logout"});
    }
    useEffect(() => {
        if (!isLoading) {
          setShowBar(!error);
        }
    }, [isLoading, error]);
    
    return (
        <AppBar sx={{zIndex:2 }}>
            <Toolbar>
                <ForumIcon sx={{marginRight: 1}}/>
                <Typography variant="h6" noWrap sx={{fontFamily:"Papyrus", letterSpacing: ".2rem"}}>
                    modulo
                </Typography>
                <Box sx ={{flexGrow:1}}></Box>
                {showBar&&(
                    <>  
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Create Post">
                                <IconButton sx={{ color:"inherit",marginRight: "5px" }}>
                                    <CreateIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                         <Box sx={{ flexGrow: 0, display:"flex",flexDirection:"row",alignItems:"center" }}>
                            <Tooltip title="User"> 
                                <IconButton sx={{ color:"inherit"}} onClick={handleOpenUserMenu}>
                                    <PersonIcon />
                                </IconButton>
                            </Tooltip>
                            <Typography>User : {data?.message}</Typography>
                            <Menu
                                sx={{marginTop:"5px"}}
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
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
    )
}



export default Navbar;