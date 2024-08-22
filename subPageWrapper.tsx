"use client";

import Grid from "@mui/material/Grid";
import Container from "@mui/system/Container";
import { ReactNode } from "react";

const SubPageWrapper = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <Container
            sx={(theme) => ({
                [theme.breakpoints.up("md")]: {
                    maxWidth: "md",
                },
                [theme.breakpoints.up("lg")]: {
                    maxWidth: "lg",
                },
            })}
        >
            <Grid container mt={6}>
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SubPageWrapper;
