import { NextResponse } from "next/server";
import {
    DatabaseIntegrityException,
    InvalidCredentialsException,
    ServiceException,
    InsufficientPermissionsException,
    NotFoundException, ExternalServiceException,
} from "@/types/exceptions";

export function routeHandlerException(error: any) {
    if (error instanceof DatabaseIntegrityException) {
        // 409 indicates a conflict, such as duplicate or invalid data that violates database constraints
        return NextResponse.json({ error: error.message }, { status: 409 });
    } else if (error instanceof InvalidCredentialsException) {
        // 401 unauthorized, credentials are invalid, but the user might authenticate successfully with valid ones
        return NextResponse.json({ error: error.message }, { status: 401 });
    } else if (error instanceof ServiceException) {
        // 400 bad request: generic client-side error, indicating invalid input or a bad request
        return NextResponse.json({ error: error.message }, { status: 400 });
    } else if (error instanceof InsufficientPermissionsException) {
        // 403 forbidden: user does not have sufficient permissions to access the resource
        return NextResponse.json({ error: error.message }, { status: 403 });
    } else if (error instanceof NotFoundException) {
        // 404 not found: resource not found
        return NextResponse.json({ error: error.message }, { status: 404 });
    } else if (error instanceof ExternalServiceException) {
        // 409 conflict: some conflict with external services
        return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Unhandled Error", error);
    // 500 internal server error: catch-all for unexpected server errors
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
