import { Fragment, ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    CssVarsTheme,
    Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getInitColorSchemeScript from "@mui/system/cssVars/getInitColorSchemeScript";

const CustomInitColorSchemeScript = () => {
    // unfortunately there is a bug with <InitColorSchemeScript /> that causes FOUC on initial mount
    // which completely defeats the purpose of using this system..
    // this getInitColorSchemeScript workaround seems ok for now
    return (
        <Fragment>
            {/* <InitColorSchemeScript /> */}
            {getInitColorSchemeScript({
                // These properties are normally set when importing from @mui/material,
                // but we have to set manually because we are importing from @mui/system.
                attribute: "data-mui-color-scheme",
                modeStorageKey: "mui-mode",
                colorSchemeStorageKey: "mui-color-scheme",
                // All options that you pass to CssVarsProvider you should also pass here.
                defaultMode: "system",
            })}
        </Fragment>
    );
};

export const ThemeProvider = ({
    children,
    theme,
}: {
    children: ReactNode;
    theme: Omit<Theme, "palette" | "applyStyles"> & CssVarsTheme;
}) => {
    return (
        <AppRouterCacheProvider>
            <CssVarsProvider theme={theme} defaultMode="system">
                <CustomInitColorSchemeScript />
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </AppRouterCacheProvider>
    );
};

export default ThemeProvider;
