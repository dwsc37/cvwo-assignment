import SellIcon from "@mui/icons-material/Sell";
import {
    Box,
    Button,
    Chip,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ModuleCard from "../components/cards/ModuleCard";
import TagsDialog from "../components/dialogs/TagsDialog";
import { Message, Post, Tag } from "../interfaces/interaces";
import {
    useCreatePostMutation,
    useGetModuleQuery,
    useGetTagsQuery,
} from "../redux/api";
import LoadingPage from "./status/LoadingPage";
import ErrorPage from "./status/ErrorPage";

const CreatePost = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { moduleCode } = useParams();
    const {
        data: module,
        isLoading,
        error,
    } = useGetModuleQuery(moduleCode as string);
    const {
        data: tags,
        isLoading: isTagsLoading,
        error: tagsError,
    } = useGetTagsQuery();
    const [createPost] = useCreatePostMutation();
    const [postData, setPostData] = useState<Post>({
        Title: "",
        Body: "",
        Tags: [],
        ModuleCode: moduleCode ? moduleCode : "",
    });

    const [showTagsDialog, setShowTagsDialog] = useState(false);

    if (isLoading || isTagsLoading) return <LoadingPage />;
    if (error || !module || tagsError || !tags) return <ErrorPage />;
    const handleTitleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setPostData((prevData) => ({
            ...prevData,
            Title: event.target.value,
        }));
    };

    const handleBodyChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setPostData((prevData) => ({
            ...prevData,
            Body: event.target.value,
        }));
    };

    const handleCreatePost = (event: React.FormEvent) => {
        event.preventDefault();
        const promise = createPost(postData).unwrap();
        toast.promise(promise, {
            loading: "Creating post...",
            success: (payload: Message) => {
                navigate("/module/" + moduleCode);
                return payload.message;
            },
            error: (payload) => {
                try {
                    return payload.data.error;
                } catch {
                    return "Error, something went wrong!";
                }
            },
        });
    };

    const handleSelectTag = (tagSelect: Tag) => () => {
        setPostData((prevData) => ({
            ...prevData,
            Tags: !postData.Tags.includes(tagSelect)
                ? postData.Tags.concat([tagSelect])
                : postData.Tags,
        }));
    };

    const handleDeleteTag = (tagDelete: Tag) => () => {
        setPostData((prevData) => ({
            ...prevData,
            Tags: postData.Tags.filter((tag: Tag) => tag.ID !== tagDelete.ID),
        }));
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
            <TagsDialog
                open={showTagsDialog}
                tags={tags}
                selectedTags={postData.Tags}
                handleClose={() => setShowTagsDialog(false)}
                handleSelect={handleSelectTag}
            />
            <Box
                component="form"
                onSubmit={handleCreatePost}
                sx={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "left",
                    paddingTop: "10px",
                }}
            >
                <Typography variant="h3">Create Post</Typography>
                <TextField
                    sx={{ width: "80%", marginBottom: "10px" }}
                    variant="outlined"
                    label="Title"
                    autoComplete="off"
                    onChange={handleTitleChange}
                    value={postData.Title}
                    required
                />
                <TextField
                    label="Body"
                    sx={{ width: "80%", height: "100%", flexGrow: 1 }}
                    autoComplete="off"
                    required
                    onChange={handleBodyChange}
                    value={postData.Body}
                    multiline
                    rows={20}
                    inputProps={{
                        sx: {
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
                            scrollbarWidth: "thin",
                        },
                        style: {
                            height: "100%",
                        },
                    }}
                />
                <Box
                    onClick={() => setShowTagsDialog(true)}
                    sx={{
                        width: "80%",
                        display: "flex",
                        flexDirection: "row",
                        border: "1px solid",
                        borderColor: theme.palette.action.disabled,
                        marginTop: "10px",
                        ":hover": {
                            borderColor: theme.palette.action.active,
                            cursor: "pointer",
                        },
                        padding: "10px",
                        gap: "10px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <SellIcon sx={{ width: "32px", height: "32px" }} />
                    <Typography sx={{ paddingTop: "3px" }}>Tags: </Typography>
                    {postData.Tags.map((tag) => {
                        return (
                            <Chip
                                key={tag.ID}
                                label={tag.Name}
                                onDelete={handleDeleteTag(tag)}
                            />
                        );
                    })}
                </Box>
                <Button type="submit" variant="contained" sx={{ width: "80%" }}>
                    Create
                </Button>
            </Box>
            <Box
                sx={{
                    width: "20%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <ModuleCard disableAction={false} module={module} />
            </Box>
        </Box>
    );
};

export default CreatePost;
