import HomeIcon from "@mui/icons-material/Home";
import { Box, Paper, Typography } from "@mui/material";
import CreatePostSidebar from "../components/CreatePostSidebar";
import GenericFeed from "../components/GenericFeed";
import { useGetHomePostsQuery } from "../redux/api";
import ErrorPage from "./status/ErrorPage";
import LoadingPage from "./status/LoadingPage";

const Home = () => {
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetHomePostsQuery();
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
                <Paper elevation={5} sx={{ padding: "10px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: "row",
                            marginBottom: "10px",
                        }}
                    >
                        <HomeIcon sx={{ width: "40px", height: "40px" }} />
                        <Typography variant="h4">Home</Typography>
                    </Box>
                    <Typography variant="h6">
                        Your personal Modulo front page. View posts from your
                        subscribed communities here.
                    </Typography>
                </Paper>

                <CreatePostSidebar />
            </Box>
        </Box>
    );
};

export default Home;
