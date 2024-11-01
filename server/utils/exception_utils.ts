import { NextResponse } from "next/server";
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException,
    InsufficientPermissionsException,
    NotFoundException,
} from "../types/exceptions";

export function routeHandlerException(error: any) {
    if (error instanceof DatabaseIntegrityException) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof InvalidCredentialsException) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    } else if (error instanceof ServiceException) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof InsufficientPermissionsException) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    } else if (error instanceof NotFoundException) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Unhandled Error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
