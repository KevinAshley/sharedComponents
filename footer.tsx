import Box from "@mui/material/Box";
import Copyright from "@/sharedComponents/copyright";

const height = "36px;";

const Footer = () => {
    return (
        <Box
            sx={{
                // height,
                marginTop: "3rem",
            }}
        >
            <Box
                component="footer"
                sx={{
                    height,
                    // marginTop: "3rem",
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        bgcolor: "var(--mui-palette-dark)",
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height,
                    }}
                >
                    <Copyright />
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
