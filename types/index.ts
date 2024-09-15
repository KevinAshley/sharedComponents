import { User } from "@prisma/client";

interface RemovedUserKeys {
    password: unknown;
    session_id: unknown;
    session_expires: unknown;
}

export interface UserContextUser extends Omit<User, keyof RemovedUserKeys> {}
