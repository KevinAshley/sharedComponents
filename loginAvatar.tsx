/** @format */

import React, { Fragment, useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styled from "@mui/system/styled";
import { UserContext } from "@/sharedComponents/contexts/userContext";
import UncontrolledModalForm from "@/sharedComponents/modalFormUncontrolled";
import { FormValuesIf, InputIf } from "@/sharedComponents/form";
import { apiFetchWrapper, ApiMethod } from "@/sharedComponents/nextApi";
import {
    MainContext,
    ToastVariant,
} from "@/sharedComponents/contexts/mainContext";
import { verify } from "crypto";

const StyledBadge = styled(Badge)({
    "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px var(--mui-palette-background-paper)`,
        "&::after": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
        },
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1,
        },
        "100%": {
            transform: "scale(2.4)",
            opacity: 0,
        },
    },
});

const loginFormInputs: InputIf[] = [
    {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
    },
    {
        id: "password",
        label: "Password",
        type: "password",
        required: true,
    },
    {
        id: "verify",
        label: "I am not a robot",
        type: "checkbox",
        required: true,
    },
];

const logoutFormInputs: InputIf[] = [
    {
        id: "name",
        label: "Name",
        type: "text",
        disabled: true,
    },
    {
        id: "email",
        label: "Email",
        type: "email",
        disabled: true,
    },
    {
        id: "log_out",
        label: "I want to log out",
        type: "checkbox",
        required: true,
    },
];

const LoginAvatar = () => {
    const { user } = useContext(UserContext);
    const { setToast } = useContext(MainContext);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const toggleDialog = () => {
        setDialogIsOpen(!dialogIsOpen);
    };

    const handleLogin = (values: FormValuesIf) => {
        setProcessing(true);
        apiFetchWrapper({
            method: ApiMethod.POST,
            uri: `/api/auth`,
            body: values,
        })
            .then(() => {
                setDialogIsOpen(false);
                setToast({
                    message: `Successfully logged in!`,
                    variant: ToastVariant.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleLogout = (values: FormValuesIf) => {
        setProcessing(true);
        apiFetchWrapper({
            method: ApiMethod.DELETE,
            uri: `/api/auth`,
            body: values,
        })
            .then(() => {
                setDialogIsOpen(false);
                setToast({
                    message: `Successfully logged out!`,
                    variant: ToastVariant.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <Fragment>
            <IconButton color={"inherit"} onClick={toggleDialog} edge="start">
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant={!!user ? "dot" : undefined}
                >
                    <AccountCircleIcon />
                </StyledBadge>
            </IconButton>
            {!user ? (
                <UncontrolledModalForm
                    title={`Log In`}
                    open={!!dialogIsOpen}
                    handleClose={() => setDialogIsOpen(false)}
                    handleSubmit={handleLogin}
                    inputs={loginFormInputs}
                    processing={processing}
                    initialValues={{}}
                    submitChangesOnly={true}
                />
            ) : (
                <UncontrolledModalForm
                    title={`Logged In`}
                    open={!!dialogIsOpen}
                    handleClose={() => setDialogIsOpen(false)}
                    handleSubmit={handleLogout}
                    inputs={logoutFormInputs}
                    processing={processing}
                    initialValues={{
                        ...user,
                        log_out: false,
                    }}
                    submitChangesOnly={true}
                />
            )}
        </Fragment>
    );
};

export default LoginAvatar;
