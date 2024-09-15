import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Header from "@/sharedComponents/header";
import Footer from "@/sharedComponents/footer";
import { StaticImageData } from "next/image";

export default function PageWrapper({
    children,
    websiteAvatar,
}: {
    children: ReactNode;
    websiteAvatar: StaticImageData;
}) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Header websiteAvatar={websiteAvatar} />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                    }}
                >
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}
