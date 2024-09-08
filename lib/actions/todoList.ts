"use server";

import { PrismaClient, TodoItem } from "@prisma/client";
import { FormValuesIf } from "@/sharedComponents/form";
import { getAuthUser } from "./auth";

const prisma = new PrismaClient();

export async function getTodoItems() {
    const user = await getAuthUser();
    const todoItems = await prisma.todoItem.findMany({
        select: {
            id: true,
            name: true,
            completed: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            userId: user.id,
        },
    });
    return todoItems;
}

export async function addTodoItem(data: FormValuesIf) {
    const user = await getAuthUser();
    const { name, completed } = data as TodoItem;
    await prisma.todoItem.create({
        data: {
            name,
            completed,
            userId: user.id,
        },
    });
    return true;
}

export async function editTodoItem({
    id,
    changedValues,
}: {
    id: number;
    changedValues: FormValuesIf;
}) {
    const user = await getAuthUser();
    const updatedItem = await prisma.todoItem.update({
        where: {
            id,
            userId: user.id,
        },
        data: changedValues,
    });
    if (!updatedItem) {
        throw new Error("Forbidden to edit this Todo Item");
    }
    return true;
}

export async function deleteTodoItems(selectedIds: number[]) {
    const user = await getAuthUser();
    const deletedItems = await prisma.todoItem.deleteMany({
        where: {
            id: {
                in: selectedIds,
            },
            userId: user.id,
        },
    });
    if (!deletedItems) {
        throw new Error("Forbidden to delete these Todo Items");
    }
    return true;
}
