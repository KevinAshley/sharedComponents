import { NextResponse } from "next/server";

export enum ApiMethod {
    GET = "GET", // get resource(s)
    POST = "POST", // add resource(s)
    PUT = "PUT", // replace resource(s)
    PATCH = "PATCH", // partially update resource(s)
    DELETE = "DELETE", // remove resource(s)
}

interface ErrorMessage {
    message: string;
}

function isErrorMessage(error: any): error is ErrorMessage {
    return typeof error?.message === "string";
}

export const handleError = (error: unknown) => {
    if (isErrorMessage(error)) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 404 }
        );
    } else {
        // this is an unexpected error.. log it to the console
        console.error("Internal server error: ", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
            },
            { status: 500 }
        );
    }
};

export const apiFetchWrapper = ({
    uri,
    method,
    body,
}: {
    uri: string;
    method: ApiMethod;
    body?: { [key: string]: any };
}) => {
    return fetch(uri, {
        method: method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((r) => r.json())
        .then((response) => {
            console.log("apiFetchWrapper response: ", response);
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        });
};

export const getIdParamFromRequest = (req: Request) => {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    return Number(searchParams.get("id"));
};

export function getUniqueIdString() {
    return (Date.now() + Math.random()).toString(36).slice(1);
}
