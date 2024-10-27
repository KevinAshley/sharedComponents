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
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import UncontrolledModalForm from "@/sharedComponents/modalFormUncontrolled";
import {
    FormValuesIf,
    InputIf,
} from "@/sharedComponents/formComponents/formInterfaces";
import { MainContext, ToastVariant } from "./mainContext";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import RoutedLink from "@/sharedComponents/routedLink";
import {
    userSignup,
    userLogin,
    userLogout,
    getAuthUserForClient,
} from "@/sharedComponents/lib/actions/auth";
import { UserContextUser } from "@/sharedComponents/types";
import AuthModalPrepend from "../authModalPrepend";

interface UserContextIf {
    user?: UserContextUser;
    userIsAdmin: boolean;
    setUserModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setLoginModalIsOpen: Dispatch<SetStateAction<boolean>>;
    setSignupModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

const defaultValue = {
    user: undefined,
    userIsAdmin: false,
    setUserModalIsOpen: () => {},
    setLoginModalIsOpen: () => {},
    setSignupModalIsOpen: () => {},
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

const UserContextProvider = (props: {
    children: React.ReactNode | React.ReactNode[];
    user?: UserContextUser;
}) => {
    const { setToast } = useContext(MainContext);
    const [user, setUser] = useState<UserContextUser | undefined>(props.user);
    const [userModalIsOpen, setUserModalIsOpen] = useState(false);
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const userIsAdmin = !!user?.admin;

    const getUser = useCallback(() => {
        getAuthUserForClient()
            .then(setUser)
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
                setUser(undefined);
            });
    }, [setToast]);

    const handleLogin = (values: FormValuesIf) => {
        setProcessing(true);
        userLogin(values)
            .then((response) => {
                console.log("KEVIN", response);
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
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
        userSignup(values)
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
                setToast({
                    message: `Successfully signed up!`,
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
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
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
                user,
                setUserModalIsOpen,
                setLoginModalIsOpen,
                setSignupModalIsOpen,
                userIsAdmin,
            }}
        >
            {props.children}
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
                    <AuthModalPrepend
                        text={"Not registered?"}
                        linkText={"Sign up"}
                        onLinkClick={switchToSignUp}
                    />
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
                    <AuthModalPrepend
                        text={"Already registered?"}
                        linkText={"Sign In"}
                        onLinkClick={switchToSignIn}
                    />
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
                prependContent={
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AccountCircleIcon sx={{ fontSize: "6rem" }} />
                    </Box>
                }
            />
        </UserContext.Provider>
    );
};

export default UserContextProvider;
