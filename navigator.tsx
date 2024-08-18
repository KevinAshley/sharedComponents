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
import ListSubheader from "@mui/material/ListSubheader";

interface RouteIf {
    label: string;
    route: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    // allow additional props
    [x: string]: unknown;
}

export interface RouteGroupIf {
    label?: string;
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
            anchor={"right"}
        >
            <List disablePadding>
                <ListItem>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </ListItem>
                <Divider sx={{ mb: 2 }} />

                {groupedRoutes.map(({ label, routes }, categoryIndex) => (
                    <Box key={categoryIndex}>
                        {label && (
                            <ListSubheader sx={{ background: "none" }}>
                                {label}
                            </ListSubheader>
                        )}

                        {routes.map(({ label, icon, route }, routeIndex) => {
                            const Icon = icon;
                            const active = pathname === route;
                            return (
                                <ListItemButton
                                    selected={active}
                                    sx={{
                                        py: "2px",
                                        px: 3,
                                    }}
                                    component={Link}
                                    href={route}
                                    onClick={onClose}
                                    key={`route-${routeIndex}`}
                                >
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText>{label}</ListItemText>
                                </ListItemButton>
                            );
                        })}
                    </Box>
                ))}
            </List>
        </Drawer>
    );
};

export default Navigator;
