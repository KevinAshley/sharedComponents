"use client";
import React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { usePathname } from "next/navigation";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface RouteIf {
    label: string;
    route: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    // allow additional props
    [x: string]: unknown;
}

export interface RouteGroupIf {
    routes: RouteIf[];
}

interface NavigatorIf {
    open: boolean;
    onClose: () => void;
    groupedRoutes: RouteGroupIf[];
}

const Navigator = ({ open, onClose, groupedRoutes }: NavigatorIf) => {
    const pathname = usePathname();

    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={onClose}
            PaperProps={{ style: { width: 256 } }}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <List disablePadding>
                <ListItem
                    sx={{
                        pt: "10px",
                        pb: "10px",
                        pr: "1rem",
                    }}
                >
                    <IconButton
                        sx={{
                            ml: "auto",
                            display: "inline-block",
                            lineHeight: 0,
                        }}
                        onClick={onClose}
                    >
                        <CloseIcon
                            sx={{
                                fontSize: "1.25rem",
                            }}
                        />
                    </IconButton>
                </ListItem>

                {groupedRoutes.map(({ routes }, categoryIndex) => (
                    <Box key={categoryIndex}>
                        <Divider sx={{ mb: 2 }} />

                        {routes.map(({ label, icon, route }, routeIndex) => {
                            const Icon = icon;
                            const active = pathname === route;
                            return (
                                <ListItem
                                    disablePadding
                                    key={`route-${routeIndex}`}
                                >
                                    <ListItemButton
                                        selected={active}
                                        sx={{
                                            py: "2px",
                                            px: 3,
                                        }}
                                        component={Link}
                                        href={route}
                                        onClick={onClose}
                                    >
                                        <ListItemIcon>
                                            <Icon />
                                        </ListItemIcon>
                                        <ListItemText>{label}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    );
};

export default Navigator;
