import { ReactNode } from "react";
import PageWrapper from "@/sharedComponents/pageWrapper";
import ThemeProvider from "@/sharedComponents/themeProvider";
import MainContextProvider from "@/sharedComponents/contexts/mainContext";
import UserContextProvider from "./contexts/userContext";
import Toast from "@/sharedComponents/toast";
import { RouteGroupIf } from "@/sharedComponents/navigator";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    CssVarsTheme,
    Theme,
} from "@mui/material/styles";
import { StaticImageData } from "next/image";
import { cookies } from "next/headers";

interface MainLayoutIf {
    children: ReactNode;
    theme: Omit<Theme, "palette" | "applyStyles"> & CssVarsTheme;
    groupedRoutes: RouteGroupIf[];
    websiteName: string;
    websiteAvatar: StaticImageData;
}

export function MainLayout({
    children,
    theme,
    groupedRoutes,
    websiteName,
    websiteAvatar,
}: MainLayoutIf) {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("sessionToken");
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider theme={theme}>
                    <MainContextProvider>
                        <UserContextProvider sessionToken={sessionToken}>
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
