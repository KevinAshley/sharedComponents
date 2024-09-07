"use client";

import { useEffect, createContext, useState, useContext } from "react";
import { User } from "@prisma/client";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { apiFetchWrapper, ApiMethod } from "@/sharedComponents/nextApi";
import { MainContext, ToastVariant } from "./mainContext";

interface RemoveThoseKeys {
    password: unknown;
    session_id: unknown;
    session_expires: unknown;
}

type PublicUserValues = Omit<User, keyof RemoveThoseKeys>;

interface UserIf extends PublicUserValues {}

interface UserContextIf {
    user?: UserIf;
}

const defaultValue = {
    user: undefined,
};

export const UserContext = createContext<UserContextIf>(defaultValue);

const UserContextProvider = ({
    sessionToken,
    children,
}: {
    sessionToken?: RequestCookie | undefined;
    children: React.ReactNode | React.ReactNode[];
}) => {
    const { setToast } = useContext(MainContext);
    const [user, setUser] = useState<UserIf | undefined>(undefined);

    useEffect(() => {
        if (sessionToken) {
            // if there is a session token, the get the USER via api endpoint
            apiFetchWrapper({
                method: ApiMethod.GET,
                uri: "/api/auth",
            })
                .then(setUser)
                .catch((err) => {
                    console.log("Problem getting user", err.message);
                    // setToast({
                    //     message: err.message,
                    //     variant: ToastVariant.ERROR,
                    // });
                });
        }
    }, [sessionToken]);

    return (
        <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    );
};

export default UserContextProvider;
