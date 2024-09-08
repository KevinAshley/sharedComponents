"use client";

import {
    useEffect,
    createContext,
    useState,
    useContext,
    Dispatch,
    SetStateAction,
    useCallback,
} from "react";
import { User } from "@prisma/client";
import { apiFetchWrapper, ApiMethod } from "@/sharedComponents/nextApi";
import UncontrolledModalForm from "@/sharedComponents/modalFormUncontrolled";
import { FormValuesIf, InputIf } from "@/sharedComponents/form";
import { MainContext, ToastVariant } from "./mainContext";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Typography } from "@mui/material";
import RoutedLink from "../routedLink";
import { userLogin, userLogout, getAuthUser } from "@/app/lib/actions/auth";

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

const signupFormInputs: InputIf[] = [
    {
        id: "name",
        label: "Name",
        type: "text",
        required: true,
    },
    ...loginFormInputs,
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
    children,
}: {
    children: React.ReactNode | React.ReactNode[];
}) => {
    const { setToast } = useContext(MainContext);
    const [user, setUser] = useState<AuthUser | undefined>(undefined);
    const [authenticating, setAuthenticating] = useState(true);
    // we have an authenticating state so we can show an intermediate
    // loading state for components that require a user
    const [userModalIsOpen, setUserModalIsOpen] = useState(false);
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const getUser = useCallback(() => {
        getAuthUser()
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
    }, [setToast]);

    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            getUser();
        }
    }, [getUser, isMounted]);

    const handleLogin = (values: FormValuesIf) => {
        setProcessing(true);
        userLogin(values)
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

    const handleSignup = (values: FormValuesIf) => {
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
                setSignupModalIsOpen(false);
                setProcessing(false);
            });
    };

    const handleLogout = (values: FormValuesIf) => {
        setProcessing(true);
        userLogout()
            .then(() => {
                setUserModalIsOpen(false);
                setToast({
                    message: `Successfully logged out!`,
                    variant: ToastVariant.SUCCESS,
                });
                setUser(undefined);
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

    const switchToSignUp = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setLoginModalIsOpen(false);
        setSignupModalIsOpen(true);
    };

    const switchToSignIn = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setSignupModalIsOpen(false);
        setLoginModalIsOpen(true);
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
                prependContent={
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AccountCircleIcon
                            sx={{ fontSize: "6rem", marginBottom: "1rem" }}
                        />
                        <Typography variant={"body1"}>
                            Not registered?{" "}
                            <RoutedLink href={"#"} onClick={switchToSignUp}>
                                Sign up
                            </RoutedLink>
                        </Typography>
                    </Box>
                }
            />
            <UncontrolledModalForm
                title={`Sign Up`}
                open={signupModalIsOpen}
                handleClose={() => setSignupModalIsOpen(false)}
                handleSubmit={handleSignup}
                inputs={signupFormInputs}
                processing={processing}
                initialValues={{}}
                submitChangesOnly={true}
                prependContent={
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AccountCircleIcon
                            sx={{ fontSize: "6rem", marginBottom: "1rem" }}
                        />
                        <Typography variant={"body1"}>
                            Already registered?{" "}
                            <RoutedLink href={"#"} onClick={switchToSignIn}>
                                Sign In
                            </RoutedLink>
                        </Typography>
                    </Box>
                }
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
