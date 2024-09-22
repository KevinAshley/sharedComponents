"use client";
import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import PaletteModeSwitch from "@/sharedComponents/paletteModeSwitch";
import Navigator from "@/sharedComponents/navigator";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import LoginAvatar from "@/sharedComponents/loginAvatar";
import { groupedRoutes, groupedRoutesForAdmins } from "@/routes";
import { UserContext } from "@/sharedComponents/contexts/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import NextLink from "next/link";

const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME as string;

function Header() {
    const { userIsAdmin } = useContext(UserContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <React.Fragment>
            <Navigator
                open={mobileOpen}
                onClose={handleDrawerToggle}
                groupedRoutes={
                    userIsAdmin ? groupedRoutesForAdmins : groupedRoutes
                }
            />
            <AppBar
                color="primary"
                enableColorOnDark={true}
                position="sticky"
                elevation={0}
            >
                <Toolbar disableGutters={true}>
                    <Container
                        sx={(theme) => ({
                            [theme.breakpoints.up("md")]: {
                                maxWidth: "md",
                            },
                            [theme.breakpoints.up("lg")]: {
                                maxWidth: "lg",
                            },
                        })}
                    >
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent={"space-between"}
                        >
                            <Grid
                                item
                                component={NextLink}
                                href={"/"}
                                sx={{
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "center",
                                    color: "inherit",
                                    textDecoration: "none",
                                    fontFamily: "monospace",
                                }}
                            >
                                <Avatar
                                    sx={{
                                        border: `3px solid var(--mui-palette-primary-dark)`,
                                        backgroundColor:
                                            "var(--mui-palette-primary-light)",
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faCode}
                                        size={"1x"}
                                    />
                                </Avatar>
                                <span>{websiteName}</span>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <PaletteModeSwitch />
                                    </Grid>
                                    <Grid item>
                                        <LoginAvatar />
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            color="inherit"
                                            aria-label="open drawer"
                                            onClick={handleDrawerToggle}
                                            edge="start"
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;
