import { FunctionComponent, ReactNode } from "react";
import { User } from "@prisma/client";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon";

interface RemovedUserKeys {
    password: unknown;
    session_id: unknown;
    session_expires: unknown;
}

export interface UserContextUser extends Omit<User, keyof RemovedUserKeys> {}

export interface RouteIf {
    pageTitle: string;
    pageDescription: string;
    label: string;
    path: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    component: FunctionComponent;
    componentWrapper?: FunctionComponent<{ children: ReactNode }>;
    github?: string;
}

export interface RouteGroupIf {
    label?: string;
    routes: RouteIf[];
}