"use client";

import { createContext, useState } from "react";

export enum toastVariants {
    "ERROR" = "error",
    "WARNING" = "warning",
    "INFO" = "info",
    "SUCCESS" = "success",
}

type ToastVariant = toastVariants;

interface MainContextIf {
    toastMessage: string;
    toastVariant: ToastVariant;
    setToast: Function;
}

const defaultValue = {
    toastMessage: "",
    toastVariant: toastVariants.INFO,
    setToast: () => {},
};

export const MainContext = createContext<MainContextIf>(defaultValue);

const MainContextProvider = ({
    children,
}: {
    children: React.ReactNode | React.ReactNode[];
}) => {
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState(toastVariants.INFO);

    const setToast = ({
        message,
        variant,
    }: {
        message: string;
        variant?: ToastVariant;
    }) => {
        setToastMessage(message);
        setToastVariant((lastVariant) => variant || lastVariant);
    };

    return (
        <MainContext.Provider
            value={{
                toastMessage,
                toastVariant,
                setToast,
            }}
        >
            {children}
        </MainContext.Provider>
    );
};

export default MainContextProvider;
