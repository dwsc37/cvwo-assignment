import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface DeleteDialogProps {
    open: boolean;
    type: string;
    handleClose: () => void;
    handleConfirm: () => void;
}

const DeleteDialog = ({
    open,
    type,
    handleClose,
    handleConfirm,
}: DeleteDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{"Delete this " + type + "?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deletion CANNOT be undone. Are you sure you want to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
