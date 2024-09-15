import Typography from "@mui/material/Typography";
const websiteName = process.env.NEXT_PUBLIC_WEBSITE_NAME as string;

export default function Copyright() {
    return (
        <Typography variant="body2" color="#fff" align="center">
            {websiteName}
            {" © "}
            {new Date().getFullYear()}
        </Typography>
    );
}
