import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SellIcon from "@mui/icons-material/Sell";
import {
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    Message,
    PostDetailed,
    PostUpdate,
    Tag,
} from "../../interfaces/interaces";
import {
    useDeletePostMutation,
    useEditPostMutation,
    useLikePostMutation,
    useUnlikePostMutation,
    useValidateQuery,
} from "../../redux/api";
import { CardButton, calculateDuration } from "../../util/helper";
import DeleteDialog from "../dialogs/DeleteDialog";
import TagsDialog from "../dialogs/TagsDialog";
interface PostCardProps {
    post: PostDetailed;
    fullScreen: boolean;
    editable: boolean;
    tags?: Tag[];
    handleClick?: () => void;
    parentHandleEdit?: () => void;
}

const PostCard = ({
    post,
    handleClick,
    editable,
    fullScreen,
    tags,
    parentHandleEdit,
}: PostCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [like] = useLikePostMutation();
    const [unlike] = useUnlikePostMutation();
    const { data } = useValidateQuery();
    const handleLike = (event: React.MouseEvent) => {
        if (post.IsLiked) {
            unlike(post);
        } else {
            like(post);
        }
    };
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePost] = useDeletePostMutation();

    const [editPost] = useEditPostMutation();
    const [editing, setEditing] = useState(editable);
    const [editedPost, setEditedPost] = useState<PostDetailed>(post);
    const handleTitleChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setEditedPost((prevData) => ({
            ...prevData,
            Title: event.target.value,
        }));
    };
    const handleBodyChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setEditedPost((prevData) => ({
            ...prevData,
            Body: event.target.value,
        }));
    };
    const handleCancel = () => {
        setEditedPost(post);
        setEditing(false);
    };
    const handleEdit = (event: React.FormEvent) => {
        event.preventDefault();
        const promise = editPost(editedPost).unwrap();
        toast.promise(promise, {
            loading: "Editing post...",
            success: (payload: Message) => {
                setEditing(false);
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

    const handleOpenDelete = (event: React.MouseEvent) => {
        setShowDeleteDialog(true);
    };
    const handleDelete = () => {
        setShowDeleteDialog(false);
        const promise = deletePost(post).unwrap();
        toast.promise(promise, {
            loading: "Deleting post...",
            success: (payload: Message) => {
                navigate("/module/" + post.ModuleCode);
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
    const [showTagsDialog, setShowTagsDialog] = useState(false);
    const handleSelectTag = (tagSelect: Tag) => () => {
        setEditedPost((prevData) => ({
            ...prevData,
            Tags:
                editedPost.Tags.findIndex((tag) => tag.ID === tagSelect.ID) ===
                -1
                    ? editedPost.Tags.concat([tagSelect])
                    : editedPost.Tags,
        }));
    };

    const handleDeleteTag = (tagDelete: Tag) => () => {
        setEditedPost((prevData) => ({
            ...prevData,
            Tags: editedPost.Tags.filter((tag: Tag) => tag.ID !== tagDelete.ID),
        }));
    };

    useEffect(() => {
        setEditedPost(post);
    }, [post]);
    return (
        <Paper
            elevation={5}
            onClick={handleClick}
            sx={{
                padding: "10px 20px 0px 20px",
                border: "1px solid",
                borderColor: theme.palette.divider,
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                width: "100%",
                ...(!fullScreen && {
                    transition: "background-color 0.3s ease",
                    ":hover": {
                        backgroundColor: `${theme.palette.action.hover}`,
                        transition: "background-color 0.1s ease",
                        cursor: "pointer",
                    },
                }),
            }}
        >
            <TagsDialog
                open={showTagsDialog}
                tags={tags ? tags : []}
                selectedTags={editedPost.Tags}
                handleClose={() => setShowTagsDialog(false)}
                handleSelect={handleSelectTag}
            />
            <DeleteDialog
                open={showDeleteDialog}
                type="post"
                handleClose={() => setShowDeleteDialog(false)}
                handleConfirm={handleDelete}
            />
            <Box sx={{ width: "7%" }}>
                <Box>
                    <CardButton>
                        <IconButton
                            component="span"
                            sx={{
                                ":hover": {
                                    transform: "scale(1.2)",
                                    transition: "transform 0.3s ease",
                                    cursor: "pointer",
                                },
                                transition: "transform 0.5s ease",
                            }}
                            onClick={handleLike}
                        >
                            <Typography
                                fontSize={20}
                                sx={{ marginRight: "5px" }}
                            >
                                {[post.LikeCount]}
                            </Typography>
                            {post.IsLiked ? (
                                <FavoriteIcon
                                    sx={{
                                        width: "32px",
                                        height: "32px",
                                        color: theme.palette.secondary.main,
                                    }}
                                />
                            ) : (
                                <FavoriteBorderOutlinedIcon
                                    sx={{
                                        width: "32px",
                                        height: "32px",
                                        color: theme.palette.secondary.main,
                                    }}
                                />
                            )}
                        </IconButton>
                    </CardButton>
                </Box>
            </Box>
            <Box
                component="form"
                onSubmit={handleEdit}
                sx={{
                    width: "93%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                }}
            >
                {editing ? (
                    <TextField
                        InputLabelProps={{ sx: { fontSize: "28px" } }}
                        InputProps={{ sx: { fontSize: "28px" } }}
                        sx={{ backgroundColor: "#fff" }}
                        multiline
                        variant="outlined"
                        label="Title"
                        autoComplete="off"
                        onChange={handleTitleChange}
                        value={editedPost.Title}
                        required
                    />
                ) : (
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            overflow: fullScreen ? "none" : "hidden",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: fullScreen ? 9000 : 1,
                            wordBreak: "break-word",
                        }}
                    >
                        {editedPost.Title}
                    </Typography>
                )}
                <Typography
                    variant="subtitle2"
                    color={theme.palette.text.secondary}
                >
                    {"Posted " +
                        calculateDuration(post.CreatedAt) +
                        " ago by: " +
                        post.Username}
                </Typography>
                {editing ? (
                    <Box
                        onClick={() => setShowTagsDialog(true)}
                        sx={{
                            width: "100%",
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
                        <Typography sx={{ paddingTop: "3px" }}>
                            Tags:{" "}
                        </Typography>
                        {editedPost.Tags.map((tag) => {
                            return (
                                <Chip
                                    key={tag.ID}
                                    label={tag.Name}
                                    onDelete={handleDeleteTag(tag)}
                                />
                            );
                        })}
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        {editedPost.Tags &&
                            editedPost.Tags.map((tag) => {
                                return <Chip key={tag.ID} label={tag.Name} />;
                            })}
                    </Box>
                )}
                <Divider />
                {editing ? (
                    <TextField
                        InputLabelProps={{ sx: { fontSize: "16px" } }}
                        InputProps={{ sx: { fontSize: "16px" } }}
                        sx={{ backgroundColor: "#fff" }}
                        multiline
                        variant="outlined"
                        label="Body"
                        autoComplete="off"
                        onChange={handleBodyChange}
                        value={editedPost.Body}
                        required
                    />
                ) : (
                    <Typography
                        contentEditable={editing}
                        suppressContentEditableWarning={editing}
                        variant="h6"
                        gutterBottom
                        sx={{
                            overflow: fullScreen ? "none" : "hidden",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: fullScreen ? 9000 : 3,
                            wordBreak: "break-word",
                        }}
                    >
                        {editedPost.Body}
                    </Typography>
                )}
                <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                    <CommentIcon />
                    <Typography flexGrow={1}>
                        {post.CommentCount +
                            (post.CommentCount === 1
                                ? " comment"
                                : " comments")}
                    </Typography>
                    {data?.message === post.Username ? (
                        editing ? (
                            <>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </>
                        ) : (
                            <>
                                <CardButton>
                                    <Tooltip title="Edit post">
                                        <EditIcon
                                            sx={{
                                                ":hover": {
                                                    transform: "scale(1.4)",
                                                    transition:
                                                        "transform 0.3s ease",
                                                    cursor: "pointer",
                                                },
                                                transition:
                                                    "transform 0.5s ease",

                                                height: "32px",
                                                width: "32px",
                                            }}
                                            onClick={
                                                fullScreen
                                                    ? () => setEditing(true)
                                                    : parentHandleEdit
                                            }
                                        />
                                    </Tooltip>
                                </CardButton>
                                <CardButton>
                                    <Tooltip title="Delete post">
                                        <DeleteIcon
                                            sx={{
                                                ":hover": {
                                                    transform: "scale(1.4)",
                                                    transition:
                                                        "transform 0.3s ease",
                                                    cursor: "pointer",
                                                },
                                                transition:
                                                    "transform 0.5s ease",
                                                height: "32px",
                                                width: "32px",
                                            }}
                                            onClick={handleOpenDelete}
                                        />
                                    </Tooltip>
                                </CardButton>
                            </>
                        )
                    ) : (
                        <></>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default PostCard;
