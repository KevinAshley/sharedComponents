import { ReactNode } from "react";
import PageWrapper from "@/sharedComponents/pageWrapper";
import ThemeProvider from "@/sharedComponents/themeProvider";
import MainContextProvider from "@/sharedComponents/contexts/mainContext";
import Toast from "@/sharedComponents/toast";
import { RouteGroupIf } from "@/sharedComponents/navigator";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    CssVarsTheme,
    Theme,
} from "@mui/material/styles";

interface MainLayoutIf {
    children: ReactNode;
    theme: Omit<Theme, "palette" | "applyStyles"> & CssVarsTheme;
    groupedRoutes: RouteGroupIf[];
    websiteName: string;
}

export function MainLayout({
    children,
    theme,
    groupedRoutes,
    websiteName,
}: MainLayoutIf) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider theme={theme}>
                    <MainContextProvider>
                        <PageWrapper
                            groupedRoutes={groupedRoutes}
                            websiteName={websiteName}
                        >
                            {children}
                        </PageWrapper>
                        <Toast />
                    </MainContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
