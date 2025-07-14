
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

export interface PaginationInput {
    first: number;
    after?: Nullable<string>;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}

export interface CreatePostInput {
    description: string;
    image?: Nullable<Upload>;
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

export interface LoginResponse {
    message: string;
    accessToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    message: string;
}

export interface LogoutResponse {
    message: string;
}

export interface EmailVerificationResponse {
    message: string;
}

export interface RecentCommentType {
    content: string;
    authorId: string;
    authorName: string;
}

export interface PostType {
    id: string;
    description: string;
    authorName: string;
    authorId: string;
    image?: Nullable<string>;
    likes: number;
    commentsCount: number;
    recentComments?: Nullable<RecentCommentType[]>;
}

export interface PostEdge {
    node: PostType;
    cursor: string;
}

export interface PageInfo {
    endCursor?: Nullable<string>;
    hasNextPage: boolean;
}

export interface PostConnection {
    edges: PostEdge[];
    pageInfo: PageInfo;
}

export interface CreatePostResponse {
    message: string;
    post: PostType;
}

export interface DeletePostResponse {
    message: string;
}

export interface IQuery {
    check(): string | Promise<string>;
    me(): string | Promise<string>;
    posts(input?: Nullable<PaginationInput>): PostConnection | Promise<PostConnection>;
}

export interface IMutation {
    verifyEmailToken(): EmailVerificationResponse | Promise<EmailVerificationResponse>;
    register(input: CreateUserInput): RegisterResponse | Promise<RegisterResponse>;
    refreshAccessToken(): RefreshTokenResponse | Promise<RefreshTokenResponse>;
    logout(): LogoutResponse | Promise<LogoutResponse>;
    login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;
    createPost(input: CreatePostInput): CreatePostResponse | Promise<CreatePostResponse>;
    deletePost(id: string): DeletePostResponse | Promise<DeletePostResponse>;
}

export type Upload = any;
type Nullable<T> = T | null;
