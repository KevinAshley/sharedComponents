/** @format */

import React, { Fragment, useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalForm from "@/sharedComponents/modalForm";
import { FormValuesIf } from "@/sharedComponents/form";
import styled from "@mui/system/styled";
import { UserContext } from "./contexts/userContext";

const loginFormInputs = [
    {
        id: "email",
        label: "Email",
        type: "email",
    },
    {
        id: "password",
        label: "Password",
        type: "password",
    },
    {
        id: "verify",
        label: "I am not a robot",
        type: "checkbox",
        required: true,
    },
];

const defaultFormValues = {
    email: "",
    password: "",
    verify: false,
};

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

const LoginAvatar = () => {
    const { user } = useContext(UserContext);
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [formValues, setFormValues] =
        useState<FormValuesIf>(defaultFormValues);
    const toggleDialog = () => {
        setDialogIsOpen(!dialogIsOpen);
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
            <ModalForm
                title={`Log In`}
                open={!!dialogIsOpen}
                handleClose={() => setDialogIsOpen(false)}
                handleSubmit={() => {}}
                inputs={loginFormInputs}
                values={formValues}
                setValues={setFormValues}
                defaultValues={defaultFormValues}
                processing={false}
            />
        </Fragment>
    );
};

export default LoginAvatar;
