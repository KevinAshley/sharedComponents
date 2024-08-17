import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import { ComponentProps } from "react";

interface RoutedLinkIf extends ComponentProps<typeof MuiLink> {
    href: string;
}

const RoutedLink = (props: RoutedLinkIf) => {
    return <MuiLink {...props} component={NextLink} />;
};

export default RoutedLink;
