import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import GenericFeed from "../components/GenericFeed";
import ModuleCard from "../components/cards/ModuleCard";
import { useGetModulePostsQuery, useGetModuleQuery } from "../redux/api";
import ErrorPage from "./status/ErrorPage";
import LoadingPage from "./status/LoadingPage";

const Module = () => {
    const navigate = useNavigate();
    const { moduleCode } = useParams();
    const {
        data: module,
        isLoading,
        error,
    } = useGetModuleQuery(moduleCode as string);
    const { data: posts, isLoading: isPostsLoading } = useGetModulePostsQuery(
        moduleCode as string
    );
    const handleCreatePost = () => {
        navigate("/module/" + moduleCode + "/create");
    };
    if (isLoading || isPostsLoading) return <LoadingPage />;
    if (error || !module) return <ErrorPage />;
    return (
        <Box
            sx={{
                padding: "10px",
                margin: "20px",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <GenericFeed
                backPath="/module/"
                posts={posts}
                linkToModule={false}
            />
            <Box
                sx={{
                    width: "20%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <ModuleCard disableAction={true} module={module} />
                <Button
                    onClick={handleCreatePost}
                    fullWidth
                    variant="contained"
                >
                    Create Post
                </Button>
            </Box>
        </Box>
    );
};
export default Module;
