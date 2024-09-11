"use server";

import { PrismaClient, TodoItem, User } from "@prisma/client";
import { FormValuesIf } from "@/sharedComponents/form";
import { getAuthUser, throwErrorIfUserIsNotAdmin } from "./auth";
import { createPasswordHash } from "@/sharedComponents/nextApi/authentication";

const prisma = new PrismaClient();

export async function getUsers() {
    const authUser = await getAuthUser();
    await throwErrorIfUserIsNotAdmin(authUser);
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            admin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return users;
}

export async function addUser(data: FormValuesIf) {
    const authUser = await getAuthUser();
    await throwErrorIfUserIsNotAdmin(authUser);
    const { name, email, password, admin } = data as User;
    await prisma.user.create({
        data: {
            name,
            email,
            password: await createPasswordHash(password),
            admin,
        },
    });
}

export async function editUser({
    id,
    changedValues,
}: {
    id: number;
    changedValues: FormValuesIf;
}) {
    const authUser = await getAuthUser();
    await throwErrorIfUserIsNotAdmin(authUser);
    let data = changedValues;
    // update user
    if (data.password) {
        data.password = await createPasswordHash(data.password as string);
    } else {
        // never set an empty string
        delete data.password;
    }
    await prisma.user.update({
        where: {
            id,
        },
        data,
    });
    return true;
}

export async function deleteUsers(selectedIds: number[]) {
    const authUser = await getAuthUser();
    await throwErrorIfUserIsNotAdmin(authUser);
    await prisma.user.deleteMany({
        where: {
            id: {
                in: selectedIds,
            },
        },
    });
    return true;
}
