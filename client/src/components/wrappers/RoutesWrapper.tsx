import { Box } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Modules from "../../pages/Modules";
import Register from "../../pages/Register";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import PageWrapper from "./PageWrapper";
import { AnimatePresence } from "framer-motion";


const RoutesWrapper = () => {
    const pathName = useLocation().pathname;
    
    return (
        <Box sx={{ display: "flex"}}>
            <Navbar />
            {!(pathName==="/login" || pathName==="/register") && <Sidebar />}
            <Box sx={{flexGrow:1, paddingTop:"64px", height:"100vh", boxSizing: "border-box"}}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path = "/login" element = {<PageWrapper key="login" redirectIfAuth={true} redirectPath="/home" ><Login /></PageWrapper>} />
                        <Route path = "/register" element = {<PageWrapper key="register" redirectIfAuth={true} redirectPath="/home" ><Register /></PageWrapper>} />
                        
                        <Route path = "/home" element = {<PageWrapper key="home" redirectIfAuth={false} redirectPath="/login" ><Home /></PageWrapper>} />
                        <Route path = "/modules" element = {<PageWrapper key="modules" redirectIfAuth={false} redirectPath="/login" ><Modules /></PageWrapper>} />
                        
                        <Route path = "*" element = {<Navigate to="/login" />} />
                    </Routes>
                </AnimatePresence>
            </Box>
        </Box>
    )
}
export default RoutesWrapper;