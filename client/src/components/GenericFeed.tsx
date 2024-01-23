import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";
import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostDetailed, Tag } from "../interfaces/interaces";
import { convertToCamelCase } from "../util/helper";
import PostCard from "./cards/PostCard";
import PostDialog, { PostDialogProps } from "./dialogs/PostDialog";
import TagsDialog from "./dialogs/TagsDialog";
import { useGetTagsQuery } from "../redux/api";

interface FeedProps {
    backPath: string;
    posts: PostDetailed[] | undefined;
    linkToModule: boolean;
}

const GenericFeed = ({ backPath, posts, linkToModule }: FeedProps) => {
    const theme = useTheme();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [scrollPos, setScrollPos] = useState(
        scrollRef.current ? scrollRef.current.scrollTop : 0
    );
    const navigate = useNavigate();
    const { moduleCode, postIDString } = useParams();
    const [newSelected, updateNewSelected] = useState(true);
    const [postDialog, setPostDialog] = useState<PostDialogProps>({
        open: false,
        postID: -1,
        moduleCode: "",
        openEditing: false,
        linkToModule: linkToModule,
        handleClose: () =>
            navigate(
                backPath === "/module/" ? backPath + moduleCode : backPath
            ),
    });
    const [filteredSortedPosts, setFilteredSortedPosts] = useState<
        PostDetailed[]
    >(posts ? posts : []);

    useEffect(() => {
        if (posts) {
            setFilteredSortedPosts(posts);
            if (!newSelected) {
                const tempSorted = [...posts].sort(
                    (post1, post2) => post2.LikeCount - post1.LikeCount
                );
                setFilteredSortedPosts(tempSorted);
            }
        }
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
        navigate(backPath + post.ModuleCode + "/view/" + post.ID);
    };

    const handleEditPost = (post: PostDetailed) => {
        setPostDialog((prevData) => ({
            ...prevData,
            openEditing: true,
        }));
        if (scrollRef.current) setScrollPos(scrollRef.current.scrollTop);
        navigate(backPath + post.ModuleCode + "/view/" + post.ID);
    };

    const [showTagDialog, setShowTagDialog] = useState(false);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const handleSelectTag = (tagSelect: Tag) => () => {
        setSelectedTags(
            !selectedTags.includes(tagSelect)
                ? selectedTags.concat([tagSelect])
                : selectedTags.filter((tag) => tag.ID !== tagSelect.ID)
        );
    };
    const {
        data: tags,
        isLoading: isTagsLoading,
        error: tagsError,
    } = useGetTagsQuery();
    return (
        <Box sx={{ width: "80%" }}>
            <PostDialog {...postDialog} />
            <TagsDialog
                open={showTagDialog}
                tags={tags ? tags : []}
                selectedTags={selectedTags}
                handleSelect={handleSelectTag}
                handleClose={() => setShowTagDialog(false)}
            />
            {!postDialog.open && (
                <Box
                    sx={{
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
                            "Search posts in " +
                            (moduleCode
                                ? moduleCode
                                : convertToCamelCase(backPath))
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                    {selectedTags.map((tag) => {
                                        return (
                                            <Chip
                                                key={tag.ID}
                                                label={tag.Name}
                                                onDelete={handleSelectTag(tag)}
                                            />
                                        );
                                    })}
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShowTagDialog(true)}
                                >
                                    <SellIcon />
                                </IconButton>
                            ),
                        }}
                    ></TextField>

                    <Paper
                        elevation={0}
                        sx={{
                            backgroundColor: theme.palette.background.default,
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
                            variant={!newSelected ? "contained" : "outlined"}
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
                        {filteredSortedPosts.length === 0 ? (
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
                                    linkToModule={linkToModule}
                                />
                            ))
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default GenericFeed;
