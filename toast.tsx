"use client";

import { useContext, useEffect, useState } from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import {
    MainContext,
    ToastItemIf,
} from "@/sharedComponents/contexts/mainContext";
import Alert from "@mui/material/Alert";

const Toast = () => {
    const { toastItems, setToastItems } = useContext(MainContext);
    const [open, setOpen] = useState(false);
    const [activeToastItem, setActiveToastItem] = useState<
        ToastItemIf | undefined
    >(undefined);

    useEffect(() => {
        if (toastItems.length && !activeToastItem) {
            // Set a new snack when we don't have an active one
            setActiveToastItem({ ...toastItems[0] });
            setToastItems((prev) => prev.slice(1));
            setOpen(true);
        } else if (toastItems.length && activeToastItem && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [toastItems, activeToastItem, open]);

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setActiveToastItem(undefined);
    };

    return (
        <Snackbar
            open={open}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            autoHideDuration={3000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
        >
            <Alert
                onClose={handleClose}
                severity={activeToastItem?.variant}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {activeToastItem?.message}
            </Alert>
        </Snackbar>
    );
};

export default Toast;
