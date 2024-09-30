import React from "react";
import Box from "@mui/material/Box";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import Typography from "@mui/material/Typography";
import RoutedLink from "@/sharedComponents/routedLink";
import { alpha } from "@mui/material/styles";

interface AuthModalPrependIf {
    text: string;
    linkText: string;
    onLinkClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const AuthModalPrepend = ({
    text,
    linkText,
    onLinkClick,
}: AuthModalPrependIf) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={(theme) => ({
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    height: "100px",
                    width: "100px",
                    marginBottom: "1rem",
                    border: `solid 5px ${alpha(
                        theme.palette.primary.main,
                        0.6
                    )}`,
                })}
            >
                <LockTwoToneIcon sx={{ fontSize: "4rem" }} />
            </Box>

            <Typography variant={"body1"}>
                {text}{" "}
                <RoutedLink href={"#"} onClick={onLinkClick}>
                    {linkText}
                </RoutedLink>
            </Typography>
        </Box>
    );
};

export default AuthModalPrepend;
