/** @format */

import React, { Fragment, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalForm from "@/sharedComponents/modalForm";

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

const LoginAvatar = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const toggleDialog = () => {
        setDialogIsOpen(!dialogIsOpen);
    };

    return (
        <Fragment>
            <IconButton color={"inherit"} onClick={toggleDialog} edge="start">
                <AccountCircleIcon />
            </IconButton>
            <ModalForm
                title={`Log In`}
                open={!!dialogIsOpen}
                handleClose={() => setDialogIsOpen(false)}
                handleSubmit={() => {}}
                inputs={loginFormInputs}
                values={formValues}
                setValues={setFormValues}
                processing={false}
            />
        </Fragment>
    );
};

export default LoginAvatar;
