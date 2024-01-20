import SearchIcon from "@mui/icons-material/Search";
import {
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModuleCard from "../components/cards/ModuleCard";
import PostCard from "../components/cards/PostCard";
import { useGetModulePostsQuery, useGetModuleQuery } from "../redux/api";
import ErrorPage from "./status/ErrorPage";
import LoadingPage from "./status/LoadingPage";
import PostDialog, { PostDialogProps } from "../components/dialogs/PostDialog";
import { PostDetailed } from "../interfaces/interaces";
import moment from "moment";

const Home = () => {
    const theme = useTheme();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [scrollPos, setScrollPos] = useState(
        scrollRef.current ? scrollRef.current.scrollTop : 0
    );
    const navigate = useNavigate();
    const { postIDString } = useParams();
    const moduleCode = "CFG1002";
    const [newSelected, updateNewSelected] = useState(true);
    const {
        data: module,
        isLoading,
        error,
    } = useGetModuleQuery(moduleCode as string);
    const {
        data: posts,
        isLoading: isPostsLoading,
        error: postsError,
    } = useGetModulePostsQuery(moduleCode as string);
    const [postDialog, setPostDialog] = useState<PostDialogProps>({
        open: false,
        postID: -1,
        moduleCode: "",
        openEditing: false,
        handleClose: () => {
            console.log("in here");
            navigate("/home");
        },
    });
    const [filteredSortedPosts, setFilteredSortedPosts] = useState<
        PostDetailed[]
    >([]);

    useEffect(() => {
        if (posts) setFilteredSortedPosts(posts);
    }, [posts]);
    useEffect(() => {
        setPostDialog((prevData) => ({
            ...prevData,
            moduleCode: moduleCode ? moduleCode : prevData.moduleCode,
            open: postIDString ? true : false,
            postID: postIDString ? parseInt(postIDString) : prevData.postID,
        }));
        if (scrollRef.current) scrollRef.current.scrollTop = scrollPos;
    }, [postIDString, postDialog.open, moduleCode, navigate, scrollPos]);

    if (isLoading || isPostsLoading) return <LoadingPage />;
    if (error || !module || postsError) return <ErrorPage />;
    const handleNewClick = () => {
        updateNewSelected(true);
        const tempSorted = [...filteredSortedPosts].sort((post1, post2) =>
            moment(post1.CreatedAt).isBefore(moment(post2.CreatedAt)) ? 1 : -1
        );
        setFilteredSortedPosts(tempSorted);
    };

    const handleTopClick = () => {
        updateNewSelected(false);
        const tempSorted = [...filteredSortedPosts].sort((post1, post2) =>
            post2.LikeCount === post1.LikeCount
                ? moment(post1.CreatedAt).isBefore(moment(post2.CreatedAt))
                    ? 1
                    : -1
                : post2.LikeCount - post1.LikeCount
        );
        setFilteredSortedPosts(tempSorted);
    };

    const handleSelectPost = (post: PostDetailed) => {
        setPostDialog((prevData) => ({
            ...prevData,
            openEditing: false,
        }));
        if (scrollRef.current) setScrollPos(scrollRef.current.scrollTop);
        navigate("/module/" + moduleCode + "/view/" + post.ID);
    };

    const handleEditPost = (post: PostDetailed) => {
        setPostDialog((prevData) => ({
            ...prevData,
            openEditing: true,
        }));
        if (scrollRef.current) setScrollPos(scrollRef.current.scrollTop);
        navigate("/module/" + moduleCode + "/view/" + post.ID);
    };
    const handleCreatePost = () => {
        navigate("/module/" + moduleCode + "/create");
    };
    return (
        <Box
            sx={{
                padding: "10px",
                margin: "20px",
                display: "flex",
                flexDirection: "row",
            }}
        >
            <PostDialog {...postDialog} />
            {!postDialog.open && (
                <>
                    <Box
                        sx={{
                            width: "80%",
                            maxWidth: "80%",
                            maxHeight: "calc(100vh - 104px)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "left",
                            overflowY: "hidden",
                            marginRight: "10px",
                        }}
                    >
                        <TextField
                            sx={{ marginBottom: "10px" }}
                            fullWidth
                            variant="outlined"
                            placeholder={
                                "Search posts in " + moduleCode + " ..."
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Paper
                            elevation={0}
                            sx={{
                                backgroundColor:
                                    theme.palette.background.default,
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                                marginBottom: "10px",
                                gap: "10px",
                            }}
                        >
                            <Button
                                onClick={handleNewClick}
                                variant={newSelected ? "contained" : "outlined"}
                            >
                                New
                            </Button>
                            <Button
                                onClick={handleTopClick}
                                variant={
                                    !newSelected ? "contained" : "outlined"
                                }
                            >
                                Top
                            </Button>
                        </Paper>

                        <Box
                            ref={scrollRef}
                            sx={{
                                maxWidth: "100%",
                                width: "100%",
                                msOverflowStyle: "none" /* IE and Edge */,
                                scrollbarWidth: "none" /* Firefox */,
                                overflowY: "scroll",
                                alignItems: "center",
                                marginBottom: "10px",
                                "> :not(style)": {
                                    margin: "0 auto 20px auto",
                                    width: "80%",
                                },
                                "> :last-child": {
                                    marginBottom: "5px",
                                },
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
                            }}
                        >
                            {!filteredSortedPosts ? (
                                <Typography>No posts here...</Typography>
                            ) : (
                                filteredSortedPosts.map((post) => (
                                    <PostCard
                                        handleClick={() => {
                                            handleSelectPost(post);
                                        }}
                                        key={post.ID}
                                        editable={false}
                                        parentHandleEdit={() => {
                                            handleEditPost(post);
                                        }}
                                        post={post}
                                        fullScreen={false}
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};
export default Home;
