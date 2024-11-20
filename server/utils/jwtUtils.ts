import jwt from "jsonwebtoken";
import {Role} from "@/types/dtos/roles";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const ACCESS_TOKEN_SECRET_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN as string;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN as string;

export function generateToken(JWT_SECRET: string, JWT_EXPIRES_IN: string, userId: number, email: string, role: Role) {
    const obj =  {
        userId,
        email,
        role
    }

    return jwt.sign(obj, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function generateAccessToken(userId: number, email: string, role: Role) {
    return generateToken(ACCESS_TOKEN_SECRET, ACCESS_TOKEN_SECRET_EXPIRES_IN, userId, email, role)
}

export function generateRefreshToken(userId: number, email: string, role: Role) {
    return generateToken(REFRESH_TOKEN_SECRET, REFRESH_TOKEN_SECRET_EXPIRES_IN, userId, email, role)
}

export function verifyToken(token: string, JWT_SECRET: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.error(e)
        return null;
    }
}

export async function verifyRefreshToken(token: string) {
    return verifyToken(token, REFRESH_TOKEN_SECRET)
}

export async function verifyAccessToken(token: string) {

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    return verifyToken(token, ACCESS_TOKEN_SECRET)
}

export async function getUserIdFromAccessToken(token: string): number | null {
    const payload = await verifyAccessToken(token);
    return payload?.userId || null;
}

export async function getRoleFromAccessToken(token: string): number | null {
    const payload = await verifyAccessToken(token);
    return payload?.role || null;
}