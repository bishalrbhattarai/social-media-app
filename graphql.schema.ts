
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RoleEnum {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface UserType {
    id: string;
    name: string;
    email: string;
    role: RoleEnum;
    bio?: Nullable<string>;
    avatar?: Nullable<string>;
    isEmailVerified: boolean;
}

export interface RegisterResponse {
    message: string;
    user: UserType;
}

export interface IQuery {
    check(): string | Promise<string>;
}

export interface IMutation {
    register(input: CreateUserInput): RegisterResponse | Promise<RegisterResponse>;
}

type Nullable<T> = T | null;
