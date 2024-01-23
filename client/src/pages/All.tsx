import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GenericFeed from "../components/GenericFeed";
import { useGetAllPostsQuery } from "../redux/api";
import LoadingPage from "./status/LoadingPage";
import ErrorPage from "./status/ErrorPage";

const All = () => {
    const navigate = useNavigate();
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetAllPostsQuery();
    const handleCreatePost = () => {
        navigate("/home/");
    };
    if (isPostsLoading) return <LoadingPage />;
    if (postsError) return <ErrorPage />;
    return (
        <Box
            sx={{
                padding: "10px",
                margin: "20px",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <GenericFeed backPath="/all/" posts={posts} linkToModule={true} />
            <Box
                sx={{
                    width: "20%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
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
export default All;
