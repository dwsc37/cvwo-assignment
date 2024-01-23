import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import {
    Box,
    Button,
    Divider,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { useState } from "react";
import { CommentDetailed, Message } from "../../interfaces/interfaces";
import {
    useDeleteCommentMutation,
    useEditCommentMutation,
    useLikeCommentMutation,
    useUnlikeCommentMutation,
    useValidateQuery,
} from "../../redux/api";
import { calculateDuration } from "../../util/helper";
import DeleteDialog from "../dialogs/DeleteDialog";
import toast from "react-hot-toast";
interface CommentCardProps {
    comment: CommentDetailed;
    moduleCode: string;
}
const CommentCard = ({ comment, moduleCode }: CommentCardProps) => {
    const theme = useTheme();
    const { data } = useValidateQuery();

    const [like] = useLikeCommentMutation();
    const [unlike] = useUnlikeCommentMutation();
    const handleLike = (event: React.MouseEvent) => {
        if (comment.IsLiked) {
            unlike(comment);
        } else {
            like(comment);
        }
    };
    const [editing, setEditing] = useState(false);
    const [editedComment, setEditedComment] =
        useState<CommentDetailed>(comment);
    const [editComment] = useEditCommentMutation();
    const handleBodyChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setEditedComment((prevData) => ({
            ...prevData,
            Body: event.target.value,
        }));
    };
    const handleEdit = (event: React.FormEvent) => {
        event.preventDefault();
        const promise = editComment(editedComment).unwrap();
        toast.promise(promise, {
            loading: "Editing comment...",
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
    const handleCancel = () => {
        setEditedComment(comment);
        setEditing(false);
    };
    const [deleteCommenet] = useDeleteCommentMutation();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const handleDelete = () => {
        setShowDeleteDialog(false);
        const promise = deleteCommenet({ comment, moduleCode }).unwrap();
        toast.promise(promise, {
            loading: "Deleting comment...",
            success: (payload: Message) => {
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
    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "row",
                padding: "10px 20px 0px 20px",
                border: "1px solid",
                borderColor: theme.palette.divider,
            }}
        >
            <DeleteDialog
                open={showDeleteDialog}
                type="comment"
                handleClose={() => setShowDeleteDialog(false)}
                handleConfirm={handleDelete}
            />
            <Box sx={{ width: "7%" }}>
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
                    <Typography fontSize={20} sx={{ marginRight: "5px" }}>
                        {[comment.LikeCount]}
                    </Typography>
                    {comment.IsLiked ? (
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
                <Typography
                    variant="subtitle2"
                    color={theme.palette.text.secondary}
                >
                    {"Posted " +
                        calculateDuration(comment.CreatedAt) +
                        " ago by: " +
                        comment.Username}
                </Typography>
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
                        value={editedComment.Body}
                        required
                    />
                ) : (
                    <Typography
                        contentEditable={editing}
                        suppressContentEditableWarning={editing}
                        variant="h6"
                        gutterBottom
                        sx={{
                            overflow: "none",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 9000,
                            wordBreak: "break-word",
                        }}
                    >
                        {editedComment.Body}
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        gap: "5px",
                    }}
                >
                    {data?.message === comment.Username ? (
                        editing ? (
                            <>
                                <Button type="submit">Save</Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <Tooltip title="Delete comment">
                                    <DeleteIcon
                                        sx={{
                                            ":hover": {
                                                transform: "scale(1.4)",
                                                transition:
                                                    "transform 0.3s ease",
                                                cursor: "pointer",
                                            },
                                            transition: "transform 0.5s ease",
                                            height: "32px",
                                            width: "32px",
                                        }}
                                        onClick={() =>
                                            setShowDeleteDialog(true)
                                        }
                                    />
                                </Tooltip>

                                <Tooltip title="Edit comment">
                                    <EditIcon
                                        sx={{
                                            ":hover": {
                                                transform: "scale(1.4)",
                                                transition:
                                                    "transform 0.3s ease",
                                                cursor: "pointer",
                                            },
                                            transition: "transform 0.5s ease",

                                            height: "32px",
                                            width: "32px",
                                        }}
                                        onClick={() => setEditing(true)}
                                    />
                                </Tooltip>
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

export default CommentCard;
