import {Role} from "@server/types/dtos/roles";

export interface User {
    id: number;
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
    password: string;
    avatar?: string;

}

export interface CreateUserRequest {
    email: string;
    phone: string;
    role: Role;
    firstName: string;
    lastName: string;
    password: string;
    avatar?: string;
}