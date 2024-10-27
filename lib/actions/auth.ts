"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { FormValuesIf } from "@/sharedComponents/formComponents/formInterfaces";
import { PrismaClient, User } from "@prisma/client";
import { createPasswordHash } from "@/sharedComponents/nextApi/authentication";
import { UserContextUser } from "@/sharedComponents/types";

const prisma = new PrismaClient();

async function createNonAdminUser(values: FormValuesIf): Promise<User> {
    const { name, email, password } = values as User;
    return await prisma.user.create({
        data: {
            name,
            email,
            password: await createPasswordHash(password),
            admin: false,
        },
    });
}

export async function getAuthUser(): Promise<User> {
    const session = await auth();
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });
        if (user) {
            return user;
        }
    }
    throw new Error("Invalid Auth User");
}

export async function getAuthUserForClient(): Promise<
    UserContextUser | undefined
> {
    try {
        const user = await getAuthUser();
        const { password, ...userContextUserProps } = user;
        return userContextUserProps;
    } catch (error) {
        return undefined;
    }
}

export async function userLogin(values: FormValuesIf) {
    try {
        await signIn("credentials", {
            ...values,
            redirect: false,
        });
        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                errorMessage: "Invalid email or password",
            };
        }
        const otherError = error as any;
        return {
            success: false,
            errorMessage: otherError.message,
        };
    }
}

export async function userLogout() {
    try {
        await signOut({ redirect: false });
        return {
            success: true,
        };
    } catch (error: any) {
        return {
            success: false,
            errorMessage: error.message,
        };
    }
}

export async function userSignup(values: FormValuesIf) {
    try {
        await createNonAdminUser(values);
        await signIn("credentials", {
            ...values,
            redirect: false,
        });
        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                errorMessage: "Invalid email or password",
            };
        }
        const otherError = error as any;
        return {
            success: false,
            errorMessage: otherError.message,
        };
    }
}

export async function throwErrorIfUserIsNotAdmin(user: User) {
    if (!user.admin) {
        throw new Error("Forbidden: only admins can access this resource");
    }
}
