/** @format */

import React, { Fragment, useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalForm from "@/sharedComponents/modalForm";
import { FormValuesIf } from "@/sharedComponents/form";

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

const LoginAvatar = () => {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [formValues, setFormValues] =
        useState<FormValuesIf>(defaultFormValues);
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
                defaultValues={defaultFormValues}
                processing={false}
            />
        </Fragment>
    );
};

export default LoginAvatar;
