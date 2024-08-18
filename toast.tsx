"use client";

import { useContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import { MainContext } from "@/sharedComponents/contexts/mainContext";
import Alert from "@mui/material/Alert";

const Toast = () => {
    const { toastMessage, toastVariant, setToast } = useContext(MainContext);
    const [open, setOpen] = useState(false);

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if (!!toastMessage) {
            setOpen(true);
        }
    }, [toastMessage]);

    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setToast({ message: "" });
            }, 300);
        }
    }, [open]);

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
