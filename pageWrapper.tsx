import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Header from "@/sharedComponents/header";
import Footer from "@/sharedComponents/footer";

export default function PageWrapper({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
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
