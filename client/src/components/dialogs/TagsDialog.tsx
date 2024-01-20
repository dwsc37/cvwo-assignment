import { Dialog, ListItemButton } from "@mui/material";
import { Tag } from "../../interfaces/interaces";

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
    return (
        <Dialog open={open} onClose={handleClose}>
            {tags.map((tag) => {
                return (
                    <ListItemButton key={tag.ID} onClick={handleSelect(tag)}>
                        {tag.Name}
                    </ListItemButton>
                );
            })}
        </Dialog>
    );
};

export default TagsDialog;
