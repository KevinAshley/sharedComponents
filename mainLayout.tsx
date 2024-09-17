"use server";
import { ReactNode } from "react";
import PageWrapper from "@/sharedComponents/pageWrapper";
import ThemeProvider from "@/sharedComponents/themeProvider";
import MainContextProvider from "@/sharedComponents/contexts/mainContext";
import UserContextProvider from "./contexts/userContext";
import Toast from "@/sharedComponents/toast";
import { CssVarsTheme, Theme } from "@mui/material/styles";
import { getAuthUserForClient } from "@/sharedComponents/lib/actions/auth";

interface MainLayoutIf {
    children: ReactNode;
    theme: Omit<Theme, "palette" | "applyStyles"> & CssVarsTheme;
}

export async function MainLayout({ children, theme }: MainLayoutIf) {
    const user = await getAuthUserForClient();
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider theme={theme}>
                    <MainContextProvider>
                        <UserContextProvider user={user}>
                            <PageWrapper>{children}</PageWrapper>
                            <Toast />
                        </UserContextProvider>
                    </MainContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
