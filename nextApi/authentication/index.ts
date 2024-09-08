"use server";
// ^ we want to make sure we don't expose this to the client

import { createHash } from "crypto";

const isProduction = process.env.NODE_ENV === "production";

const passwordSalt = isProduction
    ? process.env.PASSWORD_SALT_PROD
    : process.env.PASSWORD_SALT_DEV;

const passwordPepper = isProduction
    ? process.env.PASSWORD_PEPPER_PROD
    : process.env.PASSWORD_PEPPER_DEV;

function getRandomIdString() {
    return Math.random().toString(36).slice(2);
}

const createHashWithSaltAndPepper = ({
    secret,
    salt = getRandomIdString(),
    pepper = getRandomIdString(),
}: // if salt or pepper are missing, our hash will be random
{
    secret: string;
    salt?: string;
    pepper?: string;
}) => {
    return createHash("SHA256")
        .update(salt + secret + pepper)
        .digest("hex");
};

export const createPasswordHash = async (password: string) => {
    return createHashWithSaltAndPepper({
        secret: password,
        salt: passwordSalt,
        pepper: passwordPepper,
    });
};
