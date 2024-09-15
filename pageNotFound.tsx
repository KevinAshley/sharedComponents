import Grid from "@mui/material/Grid";
import ReportTwoToneIcon from "@mui/icons-material/ReportTwoTone";
import Box from "@mui/material/Box";
import RoutedLink from "@/sharedComponents/routedLink";

export default function PageNotFound() {
    return (
        <Grid
            container
            maxWidth="md"
            spacing={1}
            alignItems="center"
            sx={{ margin: "auto", justifyContent: "center", height: "100%" }}
        >
            <Box
                sx={{
                    textAlign: "center",
                }}
            >
                <ReportTwoToneIcon
                    color={"error"}
                    sx={{
                        fontSize: "200px",
                    }}
                />
                <h2>404: Page Not Found</h2>
                <p>Could not find requested resource</p>
                <RoutedLink href="/">Return Home</RoutedLink>
            </Box>
        </Grid>
    );
}
