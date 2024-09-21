import Box from "@mui/material/Box";
import Copyright from "@/sharedComponents/copyright";

const Footer = () => {
    return (
        <Box
            sx={{
                marginTop: "4rem",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1,
                    bgcolor: "var(--mui-palette-dark)",
                }}
            >
                <Copyright />
            </Box>
        </Box>
    );
};

export default Footer;
