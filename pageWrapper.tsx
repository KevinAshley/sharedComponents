import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Header from "@/sharedComponents/header";
import Footer from "@/sharedComponents/footer";
import { RouteGroupIf } from "@/sharedComponents/navigator";
import { StaticImageData } from "next/image";

export default function PageWrapper({
    children,
    groupedRoutes,
    websiteName,
    websiteAvatar,
}: {
    children: ReactNode;
    groupedRoutes: RouteGroupIf[];
    websiteName: string;
    websiteAvatar: StaticImageData;
}) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Header
                    groupedRoutes={groupedRoutes}
                    websiteName={websiteName}
                    websiteAvatar={websiteAvatar}
                />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                    }}
                >
                    {children}
                </Box>
                <Footer websiteName={websiteName} />
            </Box>
        </Box>
    );
}
