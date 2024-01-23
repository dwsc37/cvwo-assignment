import {
    Box,
    Dialog,
    DialogTitle,
    ListItemButton,
    Typography,
} from "@mui/material";
import { Tag } from "../../interfaces/interaces";
import DoneIcon from "@mui/icons-material/Done";

interface TagsDialogProps {
    open: boolean;
    tags: Tag[];
    selectedTags: Tag[];
    handleClose: () => void;
    handleSelect: (tag: Tag) => () => void;
}
const TagsDialog = ({
    open,
    tags,
    selectedTags,
    handleClose,
    handleSelect,
}: TagsDialogProps) => {
    console.log(selectedTags);
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Tags</DialogTitle>

            {tags.map((tag) => {
                return (
                    <ListItemButton
                        sx={{ width: "10vw" }}
                        key={tag.ID}
                        onClick={handleSelect(tag)}
                    >
                        <Typography sx={{ width: "90%" }}>
                            {tag.Name}
                        </Typography>
                        {selectedTags &&
                        selectedTags.findIndex(
                            (tagSelected) => tagSelected.ID === tag.ID
                        ) !== -1 ? (
                            <DoneIcon sx={{ width: "10%" }} />
                        ) : (
                            <Box sx={{ width: "10%" }} />
                        )}
                    </ListItemButton>
                );
            })}
        </Dialog>
    );
};

export default TagsDialog;
