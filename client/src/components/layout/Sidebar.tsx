import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import {
    Collapse,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetSubsQuery } from "../../redux/api";
import LoadingPage from "../../pages/status/LoadingPage";

const Sidebar = () => {
    const [openFeeds, setOpenFeeds] = useState(true);
    const [openModules, setOpenModules] = useState(false);

    const handleOpenFeeds = (event: React.MouseEvent) =>
        setOpenFeeds(!openFeeds);

    const handleOpenModules = (event: React.MouseEvent) =>
        setOpenModules(!openModules);

    const { data: modules, isLoading, error } = useGetSubsQuery();
    const mappedModules = useMemo(() => {
        return isLoading || error || !modules ? (
            <LoadingPage />
        ) : (
            <List>
                {modules.length === 0 && (
                    <ListItem sx={{ marginLeft: "20px" }}>
                        No Subscribed Modules
                    </ListItem>
                )}
                {modules.map((module) => (
                    <ListItemButton
                        key={module.ID}
                        component={Link}
                        to={`/module/${module.Code}`}
                        sx={{ marginLeft: "20px" }}
                    >
                        <ListItemText
                            primary={module.Code}
                            secondary={module.Name}
                        />
                    </ListItemButton>
                ))}
            </List>
        );
    }, [modules, isLoading, error]);

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                zIndex: 1,
                width: 250,
                "& .MuiDrawer-paper": {
                    width: 250,
                    boxSizing: "border-box",
                    "::-webkit-scrollbar": { width: "10px" },
                    "::-webkit-scrollbar-track": {
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "10px",
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    },
                    scrollbarWidth: "thin",
                },
            }}
        >
            <Toolbar />
            <List>
                <ListItemButton onClick={handleOpenFeeds}>
                    <ListItemIcon>
                        <DynamicFeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Feeds" />
                    {openFeeds ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openFeeds} timeout="auto" unmountOnExit>
                    <Divider />
                    <ListItemButton
                        component={Link}
                        to={"/home"}
                        sx={{ marginLeft: "20px" }}
                    >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                    <ListItemButton
                        component={Link}
                        to={"/all"}
                        sx={{ marginLeft: "20px" }}
                    >
                        <ListItemIcon>
                            <AnalyticsIcon />
                        </ListItemIcon>
                        <ListItemText primary="All" />
                    </ListItemButton>
                </Collapse>
                <Divider />
                <ListItemButton onClick={handleOpenModules}>
                    <ListItemIcon>
                        <LoyaltyIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Subscriptions" />
                    {openModules ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openModules} timeout="auto" unmountOnExit>
                    <Divider sx={{ borderBottomWidth: "1px" }} />
                    <List>{mappedModules}</List>
                </Collapse>
                <Divider />
                <ListItemButton component={Link} to="/modules">
                    <ListItemIcon>
                        <ExploreIcon />
                    </ListItemIcon>
                    <ListItemText primary="Explore Modules" />
                </ListItemButton>
            </List>
        </Drawer>
    );
};

export default Sidebar;
