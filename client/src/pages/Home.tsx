import { useNavigate } from "react-router-dom";
import { useGetHomePostsQuery } from "../redux/api";
import LoadingPage from "./status/LoadingPage";
import ErrorPage from "./status/ErrorPage";
import { Box, Button } from "@mui/material";
import GenericFeed from "../components/GenericFeed";

const Home = () => {
    const navigate = useNavigate();
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetHomePostsQuery();
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
            <GenericFeed backPath="/home/" posts={posts} linkToModule={true} />
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
                    Create Post (this is home)
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
