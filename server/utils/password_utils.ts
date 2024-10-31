import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS as string);

async function hashPassword(password: string) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export {
    hashPassword,
    comparePassword,
}