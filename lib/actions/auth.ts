"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { FormValuesIf } from "@/sharedComponents/form";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function getAuthUserOrUndefined(): Promise<User | undefined> {
    try {
        const user = await getAuthUser();
        return user;
    } catch (error) {
        return undefined;
    }
}

export async function userLogin(values: FormValuesIf) {
    try {
        const formData = new FormData();
        Object.entries(values).map(([key, value]) => {
            formData.set(key, value as any);
        });
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            throw new Error("Invalid email or password");
        }
        throw error;
    }
}

export async function userLogout() {
    try {
        await signOut();
    } catch (error) {
        throw error;
    }
}

export async function throwErrorIfUserIsNotAdmin(user: User) {
    if (!user.admin) {
        throw new Error("Forbidden: only admins can access this resource");
    }
}
