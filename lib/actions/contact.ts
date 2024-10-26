"use server";

import { FormValuesIf } from "@/sharedComponents/form";
import { PrismaClient, ContactFormSubmission } from "@prisma/client";

const prisma = new PrismaClient();

export async function addContactFormSubmission(data: FormValuesIf) {
    try {
        const { name, email, message } = data as ContactFormSubmission;
        await prisma.contactFormSubmission.create({
            data: {
                name,
                email,
                message,
            },
        });
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
