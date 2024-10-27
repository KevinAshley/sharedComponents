"use client";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";
import Script from "next/script";
import Box from "@mui/material/Box";
import { FormValueType } from "@/sharedComponents/formComponents/formInterfaces";

const turnstileSiteKey = process.env
    .NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY as string;

const TurnstileInput = ({
    value,
    setValue,
}: {
    value: FormValueType;
    setValue: (p: FormValueType) => void;
}) => {
    const { mode } = useColorScheme();
    const turnstileRef = useRef<any>();
    const mounted = useRef<boolean>(false);

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            (async () => {
                while (!window.turnstile) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                const turnstile = window.turnstile;
                turnstile.render(turnstileRef.current, {
                    sitekey: turnstileSiteKey,
                    callback: function (token: any) {
                        setValue(token);
                    },
                    theme: mode == "system" ? "auto" : mode,
                });
                return () => {
                    if (mounted.current) {
                        turnstile.remove();
                    }
                };
            })();
        }
    }, [mode, setValue]);

    return (
        <Box
            sx={(theme) => ({
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "72px",
                marginBottom: "-7px",
                minWidth: "300px",
                // background: "rgb(129 129 129 / 10%)",
                // width: "500px",
                [theme.breakpoints.down("md")]: {
                    minHeight: "65px",
                    marginBottom: "-7px",
                    minWidth: "auto",
                    "& > .turnstile": {
                        transform: "scale(0.83)",
                        position: "absolute",
                    },
                },
                "& > .hidden-input": {
                    width: "100%",
                    border: "none",
                    height: 0,
                    marginTop: "-5px",
                    marginBottom: "5px",
                    outline: "none",
                    opacity: 0,
                },
            })}
        >
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
            <div ref={turnstileRef} className={"turnstile"} />
            <input
                className={"hidden-input"}
                value={!!value ? "verified" : ""}
                onChange={() => {}}
                required={true}
            />
        </Box>
    );
};

export default TurnstileInput;
