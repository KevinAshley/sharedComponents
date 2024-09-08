"use client";

import { useEffect, createContext, useState, useContext } from "react";
import { User } from "@prisma/client";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { apiFetchWrapper, ApiMethod } from "@/sharedComponents/nextApi";

interface RemoveThoseKeys {
    password: unknown;
    session_id: unknown;
    session_expires: unknown;
}

interface AuthUser extends Omit<User, keyof RemoveThoseKeys> {}

interface UserContextIf {
    user?: AuthUser;
    getUser: () => void;
    clearUser: () => void;
}

const defaultValue = {
    user: undefined,
    getUser: () => {},
    clearUser: () => {},
};

export const UserContext = createContext<UserContextIf>(defaultValue);

const UserContextProvider = ({
    sessionToken,
    children,
}: {
    sessionToken?: RequestCookie | undefined;
    children: React.ReactNode | React.ReactNode[];
}) => {
    const [user, setUser] = useState<AuthUser | undefined>(undefined);

    const getUser = () => {
        apiFetchWrapper({
            method: ApiMethod.GET,
            uri: "/api/auth",
        })
            .then(setUser)
            .catch((err) => {
                console.log("Problem getting user", err.message);
                setUser(undefined);
            });
    };

    const clearUser = () => {
        setUser(undefined);
    };

    useEffect(() => {
        if (sessionToken) {
            // if there is a session token, the get the USER via api endpoint
            getUser();
        }
    }, [sessionToken]);

    return (
        <UserContext.Provider value={{ user, getUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
