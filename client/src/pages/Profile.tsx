import PersonIcon from "@mui/icons-material/Person";
import { Box, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useParams } from "react-router-dom";
import GenericFeed from "../components/GenericFeed";
import {
    useGetProfilePostsQuery,
    useGetUserInfoQuery,
    useValidateQuery,
} from "../redux/api";
import ErrorPage from "./status/ErrorPage";
import LoadingPage from "./status/LoadingPage";
import CreatePostSidebar from "../components/CreatePostSidebar";

const Profile = () => {
    const { username } = useParams();
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetProfilePostsQuery(username ? username : "");
    const {
        data: userInfo,
        isLoading: isUserLoading,
        error: userError,
    } = useGetUserInfoQuery(username ? username : "");
    const { data } = useValidateQuery();
    if (isPostsLoading || isUserLoading) return <LoadingPage />;
    if (postsError || userError || !userInfo) return <ErrorPage />;
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
                backPath={"/profile/" + username + "/"}
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
                <Paper elevation={5} sx={{ padding: "10px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "10px",
                            flexDirection: "row",
                            marginBottom: "10px",
                        }}
                    >
                        <PersonIcon sx={{ width: "40px", height: "40px" }} />
                        <Typography variant="h4">
                            {userInfo.Username}
                        </Typography>
                    </Box>
                    <Typography variant="subtitle1">
                        {"Account created: " +
                            moment(userInfo.CreatedAt).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography variant="h6">
                        {"Posts: " + userInfo.NumPosts}
                    </Typography>
                    <Typography variant="h6">
                        {"Comments: " + userInfo.NumComments}
                    </Typography>
                    <Typography variant="h6">
                        {"Subscriptions: " + userInfo.NumSubscriptions}
                    </Typography>
                </Paper>
                {data?.message === userInfo.Username && <CreatePostSidebar />}
            </Box>
        </Box>
    );
};
export default Profile;
