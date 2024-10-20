"use client";

import { Fragment } from "react";
import { GoogleAnalytics as GoogleAnalyticsScript } from "@next/third-parties/google";

const measurementId = process.env
    .NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID as string | undefined;

const GoogleAnalytics = () => {
    if (process.env.NODE_ENV === "production" && measurementId) {
        return <GoogleAnalyticsScript gaId={measurementId} />;
    }
    return <Fragment></Fragment>;
};

export default GoogleAnalytics;
