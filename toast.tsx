"use client";

import { useContext, useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
    MainContext,
    toastVariants,
} from "@/sharedComponents/contexts/mainContext";
import Alert from "@mui/material/Alert";

const Toast = () => {
    const { toastMessage, toastVariant, setToast } = useContext(MainContext);
    const open = !!toastMessage;

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setToast({ message: "" });
    };

    return (
        <div>
            <Snackbar
                open={open}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={toastVariant}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Toast;
