import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import ErrorPage from "../../pages/status/ErrorPage";
import CloseIcon from "@mui/icons-material/Close";
import LoadingPage from "../../pages/status/LoadingPage";
import {
    useCreateCommentMutation,
    useGetPostCommentsQuery,
    useGetPostQuery,
    useGetTagsQuery,
} from "../../redux/api";
import PostCard from "../cards/PostCard";
import { useParams } from "react-router-dom";
import CommentCard from "../cards/CommentCard";
import { useState } from "react";
import { create } from "domain";
import toast from "react-hot-toast";
import { Message } from "../../interfaces/interaces";

export interface PostDialogProps {
    open: boolean;
    postID: number;
    openEditing: boolean;
    moduleCode: string;
    handleClose: () => void;
}
const PostDialog = ({
    open,
    postID,
    openEditing,
    moduleCode,
    handleClose,
}: PostDialogProps) => {
    const {
        data: tags,
        isLoading: isTagsLoading,
        error: tagsError,
    } = useGetTagsQuery();
    const {
        data: post,
        isLoading: isPostLoading,
        error: postError,
    } = useGetPostQuery(postID);
    const {
        data: comments,
        isLoading: isCommentsLoading,
        error: commentsError,
    } = useGetPostCommentsQuery(postID);

    const [newComment, setNewComment] = useState<string>("");
    const [createComment] = useCreateCommentMutation();
    const handleCommentChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNewComment(event.target.value);
    };
    const handleCreateComment = () => {
        const promise = createComment({
            comment: newComment,
            postID: postID,
            moduleCode: moduleCode,
        }).unwrap();
        toast.promise(promise, {
            loading: "Creating comment...",
            success: (payload: Message) => {
                setNewComment("");
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
        <Dialog
            PaperProps={{
                sx: {
                    minHeight: "90vh",
                    maxHeight: "90vh",
                    minWidth: "60vw",
                    maxWidth: "60vw",
                },
            }}
            open={open}
            onClose={handleClose}
        >
            {isTagsLoading ||
            isPostLoading ||
            isCommentsLoading ||
            (!postError && post && post.ID !== postID) ||
            (!commentsError &&
                ((!comments && post?.CommentCount !== 0) ||
                    (comments && comments[0].PostID !== postID))) ? (
                <LoadingPage />
            ) : tagsError ||
              postError ||
              commentsError ||
              !post ||
              !tags ||
              post.ModuleCode !== moduleCode ? (
                <ErrorPage />
            ) : (
                <DialogContent
                    sx={{
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
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                    dividers={true}
                >
                    <PostCard
                        editable={openEditing}
                        tags={tags}
                        post={post}
                        fullScreen={true}
                    />
                    <Box>
                        <Typography>Add a comment</Typography>
                        <TextField
                            sx={{ marginTop: "10px", marginBottom: "10px" }}
                            fullWidth
                            multiline
                            rows={3}
                            label="What are your thoughts?"
                            placeholder="Enter comment"
                            value={newComment}
                            onChange={handleCommentChange}
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
                            sx={{
                                display: "flex",
                                flexDirection: "row-reverse",
                            }}
                        >
                            <Button
                                variant="contained"
                                disabled={newComment === ""}
                                onClick={handleCreateComment}
                            >
                                Comment
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {comments ? (
                            comments.map((comment) => (
                                <CommentCard
                                    key={comment.ID}
                                    moduleCode={moduleCode}
                                    comment={comment}
                                />
                            ))
                        ) : (
                            <Typography>No comments here...</Typography>
                        )}
                    </Box>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default PostDialog;
