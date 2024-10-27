"use server";

import { FormValuesIf } from "@/sharedComponents/formComponents/formInterfaces";
import { PrismaClient, ContactFormSubmission } from "@prisma/client";

const prisma = new PrismaClient();
const cloudflareTurnstileSecretKey = process.env
    .CLOUDFLARE_TURNSTILE_SECRET_KEY as string;

export async function addContactFormSubmission(data: FormValuesIf) {
    try {
        const { turnstileToken } = data;
        const { name, email, message } = data as ContactFormSubmission;
        let verificationFormData = new FormData();
        verificationFormData.append("secret", cloudflareTurnstileSecretKey);
        verificationFormData.append("response", turnstileToken as string);
        const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        const turnstileVerifyResponse = await fetch(url, {
            body: verificationFormData,
            method: "POST",
        });
        const turnstileVerifyOutcome = await turnstileVerifyResponse.json();
        if (!turnstileVerifyOutcome.success) {
            throw new Error("Invalid Cloudflare Verification");
        }
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
