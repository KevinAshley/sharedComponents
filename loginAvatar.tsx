import React, { Fragment, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styled from "@mui/system/styled";
import { UserContext } from "@/sharedComponents/contexts/userContext";

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
    const { user, setUserModalIsOpen, setLoginModalIsOpen } =
        useContext(UserContext);

    const openDialog = () => {
        if (user) {
            setUserModalIsOpen(true);
        } else {
            setLoginModalIsOpen(true);
        }
    };

    return (
        <Fragment>
            <IconButton color={"inherit"} onClick={openDialog} edge="start">
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant={!!user ? "dot" : undefined}
                >
                    <AccountCircleIcon />
                </StyledBadge>
            </IconButton>
        </Fragment>
    );
};

export default LoginAvatar;
