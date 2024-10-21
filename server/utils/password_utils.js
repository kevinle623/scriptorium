import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

async function hashPassword(password) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

export {
    hashPassword,
    comparePassword,
}