import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

export function generateToken(JWT_SECRET, JWT_EXPIRES_IN, userId, email, role) {
    const obj =  {
        userId,
        email,
        role
    }

    return jwt.sign(obj, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function generateAccessToken(userId, email, role) {
    return generateToken(ACCESS_TOKEN_SECRET, ACCESS_TOKEN_SECRET_EXPIRES_IN, userId, email, role)
}

export function generateRefreshToken(userId, email, role) {
    return generateToken(REFRESH_TOKEN_SECRET, REFRESH_TOKEN_SECRET_EXPIRES_IN, userId, email, role)
}

export function verifyToken(token, JWT_SECRET) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.error(e)
        return null;
    }
}

export function verifyRefreshToken(token) {
    return verifyToken(token, REFRESH_TOKEN_SECRET)
}

export function verifyAccessToken(token) {
    return verifyToken(token, ACCESS_TOKEN_SECRET)
}