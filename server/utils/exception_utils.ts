import { NextResponse } from "next/server";
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException,
    InsufficientPermissionsException,
    NotFoundException,
} from "@/types/exceptions";

export function routeHandlerException(error: any) {
    if (error instanceof DatabaseIntegrityException) {
        // 409 Conflict: Indicates a conflict, such as duplicate or invalid data that violates database constraints
        return NextResponse.json({ error: error.message }, { status: 409 });
    } else if (error instanceof InvalidCredentialsException) {
        // 401 Unauthorized: Credentials are invalid, but the user might authenticate successfully with valid ones
        return NextResponse.json({ error: error.message }, { status: 401 });
    } else if (error instanceof ServiceException) {
        // 400 Bad Request: Generic client-side error, indicating invalid input or a bad request
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof InsufficientPermissionsException) {
        // 403 Forbidden: User does not have sufficient permissions to access the resource
        return NextResponse.json({ error: error.message }, { status: 403 });
    } else if (error instanceof NotFoundException) {
        // 404 Not Found: Resource not found
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Unhandled Error", error);
    // 500 Internal Server Error: Catch-all for unexpected server errors
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
