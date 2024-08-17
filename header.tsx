"use client";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import PaletteModeSwitch from "@/sharedComponents/paletteModeSwitch";
import Navigator, { RouteGroupIf } from "@/sharedComponents/navigator";

function Header({
    groupedRoutes,
    headerText,
}: {
    groupedRoutes: RouteGroupIf[];
    headerText: string;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <React.Fragment>
            <Navigator
                open={mobileOpen}
                onClose={handleDrawerToggle}
                groupedRoutes={groupedRoutes}
            />
            <AppBar
                color="primary"
                enableColorOnDark={true}
                position="sticky"
                elevation={0}
            >
                <Toolbar sx={{ pb: "8px" }}>
                    <Grid
                        container
                        maxWidth="md"
                        spacing={1}
                        alignItems="center"
                        sx={(theme) => ({
                            margin: "auto",
                            maxWidth: "md",
                            [theme.breakpoints.up("lg")]: {
                                maxWidth: "lg",
                            },
                        })}
                    >
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
                        <Grid
                            sx={{
                                display: {
                                    // textTransform: "uppercase",
                                    fontFamily: "monospace",
                                },
                            }}
                            item
                        >
                            {headerText}
                        </Grid>
                        <Grid item xs />
                        <Grid item>
                            <PaletteModeSwitch />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;
