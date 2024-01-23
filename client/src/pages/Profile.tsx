import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GenericFeed from "../components/GenericFeed";
import { useGetProfilePostsQuery } from "../redux/api";
import ErrorPage from "./status/ErrorPage";
import LoadingPage from "./status/LoadingPage";

const Profile = () => {
    const navigate = useNavigate();
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetProfilePostsQuery();
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
            <GenericFeed
                backPath="/profile/"
                posts={posts}
                linkToModule={true}
            />
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
export default Profile;
