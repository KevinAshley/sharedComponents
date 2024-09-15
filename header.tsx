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
import Image, { StaticImageData } from "next/image";
import Container from "@mui/material/Container";
import LoginAvatar from "@/sharedComponents/loginAvatar";
import { groupedRoutes, groupedRoutesForAdmins } from "@/routes";
import { UserContext } from "@/sharedComponents/contexts/userContext";

const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME as string;

function Header({ websiteAvatar }: { websiteAvatar: StaticImageData }) {
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
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar
                                    sx={{
                                        border: `3px solid var(--mui-palette-primary-dark)`,
                                    }}
                                >
                                    <Image
                                        src={websiteAvatar}
                                        alt="kevin gray sky"
                                        width={40}
                                        height={40}
                                    />
                                </Avatar>
                            </Grid>
                            <Grid
                                sx={{
                                    display: {
                                        // textTransform: "uppercase",
                                        fontFamily: "monospace",
                                    },
                                }}
                                item
                            >
                                {websiteName}
                            </Grid>
                            <Grid item xs />
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
                    </Container>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;
