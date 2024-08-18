"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

export enum ToastVariant {
    "ERROR" = "error",
    "WARNING" = "warning",
    "INFO" = "info",
    "SUCCESS" = "success",
}

export interface ToastItemIf {
    message: string;
    variant: ToastVariant;
}

interface MainContextIf {
    toastItems: ToastItemIf[];
    setToastItems: Dispatch<SetStateAction<ToastItemIf[]>>;
    setToast: Function;
}

export const MainContext = createContext<MainContextIf>({
    toastItems: [],
    setToastItems: () => {},
    setToast: () => {},
});

const MainContextProvider = ({
    children,
}: {
    children: React.ReactNode | React.ReactNode[];
}) => {
    const [toastItems, setToastItems] = useState<ToastItemIf[]>([]);

    const setToast = ({
        message,
        variant = ToastVariant.INFO,
    }: {
        message: string;
        variant?: ToastVariant;
    }) => {
        setToastItems((prev) => [...prev, { message, variant }]);
    };

    return (
        <MainContext.Provider
            value={{
                toastItems,
                setToastItems,
                setToast,
            }}
        >
            {children}
        </MainContext.Provider>
    );
};

export default MainContextProvider;
