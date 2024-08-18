import { createHash, createPrivateKey } from "crypto";

const isProduction = process.env.NODE_ENV === "production";

const jwtPrivateKey = isProduction
    ? process.env.JWT_PRIVATE_KEY_PROD
    : process.env.JWT_PRIVATE_KEY_DEV;

const passwordSalt = isProduction
    ? process.env.PASSWORD_SALT_PROD
    : process.env.PASSWORD_SALT_DEV;

const passwordPepper = isProduction
    ? process.env.PASSWORD_PEPPER_PROD
    : process.env.PASSWORD_PEPPER_DEV;

const sessionSalt = isProduction
    ? process.env.SESSION_SALT_PROD
    : process.env.SESSION_SALT_DEV;

const sessionPepper = isProduction
    ? process.env.SESSION_PEPPER_PROD
    : process.env.SESSION_PEPPER_DEV;

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

export const createPasswordHash = (password: string) => {
    return createHashWithSaltAndPepper({
        secret: password,
        salt: passwordSalt,
        pepper: passwordPepper,
    });
};

export const createSessionHash = (
    sessionId: string,
    userAgent: string = "MISSING",
    ip: string = "MISSING"
) => {
    return createHashWithSaltAndPepper({
        secret: sessionId + userAgent + ip,
        salt: sessionSalt,
        pepper: sessionPepper,
    });
};
