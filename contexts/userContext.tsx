"use client";

import {
    useEffect,
    createContext,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
} from "react";
import { User } from "@prisma/client";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { apiFetchWrapper, ApiMethod } from "@/sharedComponents/nextApi";
import UncontrolledModalForm from "@/sharedComponents/modalFormUncontrolled";
import { FormValuesIf, InputIf } from "@/sharedComponents/form";
import { MainContext, ToastVariant } from "./mainContext";

interface RemoveThoseKeys {
    password: unknown;
    session_id: unknown;
    session_expires: unknown;
}

interface AuthUser extends Omit<User, keyof RemoveThoseKeys> {}

interface UserContextIf {
    authenticating: boolean;
    user?: AuthUser;
    setUserModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setLoginModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultValue = {
    authenticating: true,
    user: undefined,
    setUserModalIsOpen: () => {},
    setLoginModalIsOpen: () => {},
};

export const UserContext = createContext<UserContextIf>(defaultValue);

const loginFormInputs: InputIf[] = [
    {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
    },
    {
        id: "password",
        label: "Password",
        type: "password",
        required: true,
    },
    {
        id: "verify",
        label: "I am not a robot",
        type: "checkbox",
        required: true,
    },
];

const logoutFormInputs: InputIf[] = [
    {
        id: "name",
        label: "Name",
        type: "text",
        disabled: true,
    },
    {
        id: "email",
        label: "Email",
        type: "email",
        disabled: true,
    },
    {
        id: "log_out",
        label: "I want to log out",
        type: "checkbox",
        required: true,
    },
];

const UserContextProvider = ({
    sessionToken,
    children,
}: {
    sessionToken?: RequestCookie | undefined;
    children: React.ReactNode | React.ReactNode[];
}) => {
    const { setToast } = useContext(MainContext);
    const [user, setUser] = useState<AuthUser | undefined>(undefined);
    const [authenticating, setAuthenticating] = useState(true);
    // we have an authenticating state so we can show an intermediate
    // loading state for components that require a user
    const [userModalIsOpen, setUserModalIsOpen] = useState(false);
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const getUser = () => {
        apiFetchWrapper({
            method: ApiMethod.GET,
            uri: "/api/auth",
        })
            .then(setUser)
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
                setUser(undefined);
            })
            .finally(() => {
                setAuthenticating(false);
            });
    };

    const clearUser = () => {
        setUser(undefined);
    };

    useEffect(() => {
        // sessionToken never changes, it comes as props from the server
        // this useEffect will only fire one time on mount
        if (sessionToken) {
            // if there is a session token, the get the USER via api endpoint
            getUser();
        } else {
            setAuthenticating(false);
        }
    }, [sessionToken]);

    const handleLogin = (values: FormValuesIf) => {
        setProcessing(true);
        apiFetchWrapper({
            method: ApiMethod.POST,
            uri: `/api/auth`,
            body: values,
        })
            .then(() => {
                setToast({
                    message: `Successfully logged in!`,
                    variant: ToastVariant.SUCCESS,
                });
                getUser();
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setLoginModalIsOpen(false);
                setProcessing(false);
            });
    };

    const handleLogout = (values: FormValuesIf) => {
        setProcessing(true);
        apiFetchWrapper({
            method: ApiMethod.DELETE,
            uri: `/api/auth`,
            body: values,
        })
            .then(() => {
                setUserModalIsOpen(false);
                setToast({
                    message: `Successfully logged out!`,
                    variant: ToastVariant.SUCCESS,
                });
                clearUser();
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    return (
        <UserContext.Provider
            value={{
                authenticating,
                user,
                setUserModalIsOpen,
                setLoginModalIsOpen,
            }}
        >
            {children}
            <UncontrolledModalForm
                title={`Log In`}
                open={loginModalIsOpen}
                handleClose={() => setLoginModalIsOpen(false)}
                handleSubmit={handleLogin}
                inputs={loginFormInputs}
                processing={processing}
                initialValues={{}}
                submitChangesOnly={true}
            />

            <UncontrolledModalForm
                title={`Logged In`}
                open={userModalIsOpen}
                handleClose={() => setUserModalIsOpen(false)}
                handleSubmit={handleLogout}
                inputs={logoutFormInputs}
                processing={processing}
                initialValues={{
                    ...user,
                    log_out: false,
                }}
                submitChangesOnly={true}
            />
        </UserContext.Provider>
    );
};

export default UserContextProvider;
