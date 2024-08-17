import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({
    title,
    open,
    handleClose,
    children,
    handleSubmit,
    submitText,
    processing,
    noCancel,
    disabled,
}: {
    title: string;
    open: boolean;
    handleClose: () => void;
    children: React.ReactNode;
    handleSubmit: VoidFunction;
    submitText?: string;
    processing?: boolean;
    noCancel?: boolean;
    disabled?: boolean;
}) => {
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{ paddingTop: "10px", paddingBottom: "10px" }}
            >
                <span>{title}</span>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers={true}>{children}</DialogContent>
            <DialogActions sx={{ padding: "8px 24px" }}>
                {!noCancel && (
                    <Button onClick={handleClose} disabled={processing}>
                        Cancel
                    </Button>
                )}
                <Button
                    onClick={handleSubmit}
                    variant={"contained"}
                    disabled={disabled || processing}
                    fullWidth={noCancel}
                >
                    {submitText || "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Modal;
