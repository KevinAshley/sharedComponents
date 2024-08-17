import Typography from "@mui/material/Typography";

export default function Copyright({ websiteName }: { websiteName: string }) {
    return (
        <Typography variant="body2" color="#fff" align="center">
            {websiteName}
            {" © "}
            {new Date().getFullYear()}
        </Typography>
    );
}
