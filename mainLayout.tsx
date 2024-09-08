"use server";
import { ReactNode } from "react";
import PageWrapper from "@/sharedComponents/pageWrapper";
import ThemeProvider from "@/sharedComponents/themeProvider";
import MainContextProvider from "@/sharedComponents/contexts/mainContext";
import UserContextProvider from "./contexts/userContext";
import Toast from "@/sharedComponents/toast";
import { RouteGroupIf } from "@/sharedComponents/navigator";
import { CssVarsTheme, Theme } from "@mui/material/styles";
import { StaticImageData } from "next/image";
import { getAuthUserOrUndefined } from "@/sharedComponents/lib/actions/auth";

interface MainLayoutIf {
    children: ReactNode;
    theme: Omit<Theme, "palette" | "applyStyles"> & CssVarsTheme;
    groupedRoutes: RouteGroupIf[];
    websiteName: string;
    websiteAvatar: StaticImageData;
}

export async function MainLayout({
    children,
    theme,
    groupedRoutes,
    websiteName,
    websiteAvatar,
}: MainLayoutIf) {
    const user = await getAuthUserOrUndefined();
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider theme={theme}>
                    <MainContextProvider>
                        <UserContextProvider user={user}>
                            <PageWrapper
                                groupedRoutes={groupedRoutes}
                                websiteName={websiteName}
                                websiteAvatar={websiteAvatar}
                            >
                                {children}
                            </PageWrapper>
                            <Toast />
                        </UserContextProvider>
                    </MainContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
