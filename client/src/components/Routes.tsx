import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PageWrapper from "./PageWrapper";
import { AnimatePresence } from "framer-motion";


const WrappedRoutes = () => {
    return (
        <AnimatePresence mode="wait">
        <Routes>
            <Route path = "/" element = {<PageWrapper redirectIfAuth={false} redirectPath="/login" ><Home /></PageWrapper>} />
            <Route path = "/login" element = {<PageWrapper redirectIfAuth={true} redirectPath="/" ><Login /></PageWrapper>} />
            <Route path = "/register" element = {<PageWrapper redirectIfAuth={true} redirectPath="/" ><Register /></PageWrapper>} />
        </Routes>
        </AnimatePresence>
    )
}

export default WrappedRoutes;
//location={location} key={location.pathname}