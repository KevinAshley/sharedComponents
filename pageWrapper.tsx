import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Header from "@/sharedComponents/header";
import Footer from "@/sharedComponents/footer";

export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Header />
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
