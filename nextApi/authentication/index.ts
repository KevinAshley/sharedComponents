import { createHash } from "crypto";

const passwordSalt = process.env.PASSWORD_SALT as string;
const passwordPepper = process.env.PASSWORD_PEPPER as string;

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
    salt: string;
    pepper: string;
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
