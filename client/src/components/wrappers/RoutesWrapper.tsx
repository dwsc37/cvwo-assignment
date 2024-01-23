import { Box } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CreatePost from "../../pages/CreatePost";
import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Module from "../../pages/Module";
import Modules from "../../pages/Modules";
import Register from "../../pages/Register";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import AuthWrapper from "./AuthWrapper";
import All from "../../pages/All";
import { Feed } from "@mui/icons-material";
import GenericFeed from "../GenericFeed";
import Profile from "../../pages/Profile";

const RoutesWrapper = () => {
    const pathName = useLocation().pathname;
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar />
            {!(pathName === "/login" || pathName === "/register") && (
                <Sidebar />
            )}
            <Box
                sx={{
                    flexGrow: 1,
                    marginTop: "64px",
                    maxHeight: "calc(100vh - 64px)",
                    boxSizing: "border-box",
                }}
            >
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthWrapper
                                redirectIfAuth={true}
                                redirectPath="/home"
                            >
                                {" "}
                                <Login />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AuthWrapper
                                redirectIfAuth={true}
                                redirectPath="/home"
                            >
                                {" "}
                                <Register />{" "}
                            </AuthWrapper>
                        }
                    />

                    <Route
                        path="/home"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Home />{" "}
                            </AuthWrapper>
                        }
                    />

                    <Route
                        path="/home/:moduleCode/view/:postIDString"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Home />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/modules"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Modules />{" "}
                            </AuthWrapper>
                        }
                    />

                    <Route
                        path="/module/:moduleCode"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Module />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/module/:moduleCode/view/:postIDString"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Module />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/module/:moduleCode/create"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                <CreatePost />
                            </AuthWrapper>
                        }
                    />

                    <Route
                        path="/all"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <All />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/all/:moduleCode/view/:postIDString"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <All />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/profile/:username"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Profile />{" "}
                            </AuthWrapper>
                        }
                    />
                    <Route
                        path="/profile/:username/:moduleCode/view/:postIDString"
                        element={
                            <AuthWrapper
                                redirectIfAuth={false}
                                redirectPath="/login"
                            >
                                {" "}
                                <Profile />{" "}
                            </AuthWrapper>
                        }
                    />

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Box>
        </Box>
    );
};
export default RoutesWrapper;
