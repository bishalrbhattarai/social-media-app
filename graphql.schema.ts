
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

export enum FriendshipStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Declined = "Declined",
    Blocked = "Blocked"
}

export enum FriendRequestAction {
    ACCEPT = "ACCEPT",
    DECLINE = "DECLINE"
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

export interface UpdatePostInput {
    description?: Nullable<string>;
    image?: Nullable<Upload>;
}

export interface CreateCommentInput {
    postId: string;
    content: string;
    parentCommentId?: Nullable<string>;
}

export interface DeleteCommentInput {
    postId: string;
    commentId: string;
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
    commentId: string;
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
    isLikedByMe?: Nullable<boolean>;
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

export interface UpdatePostResponse {
    message: string;
    post: PostType;
}

export interface FriendshipType {
    id: string;
    requester: string;
    requesterName: string;
    recipient: string;
    recipientName: string;
    status: FriendshipStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface FriendshipEdge {
    node: FriendshipType;
    cursor: string;
}

export interface FriendshipPageInfo {
    endCursor?: Nullable<string>;
    hasNextPage: boolean;
}

export interface FriendshipConnection {
    edges: FriendshipEdge[];
    pageInfo: FriendshipPageInfo;
}

export interface ConversationParticipantType {
    userId: string;
    name: string;
    avatar?: Nullable<string>;
}

export interface RecentMessageType {
    senderId: string;
    senderName: string;
    senderAvatar?: Nullable<string>;
    content: string;
    createdAt: DateTime;
}

export interface ConversationType {
    id: string;
    participants: ConversationParticipantType[];
    recentMessages: RecentMessageType[];
    lastMessageAt?: Nullable<DateTime>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface MessageType {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: Nullable<string>;
    content: string;
    read: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface MessageEdge {
    node: MessageType;
    cursor: string;
}

export interface MessagePageInfo {
    endCursor?: Nullable<string>;
    hasNextPage: boolean;
}

export interface MessageConnection {
    edges: MessageEdge[];
    pageInfo: MessagePageInfo;
}

export interface IQuery {
    check(): string | Promise<string>;
    me(): string | Promise<string>;
    posts(input?: Nullable<PaginationInput>): PostConnection | Promise<PostConnection>;
    myPosts(input?: Nullable<PaginationInput>): PostConnection | Promise<PostConnection>;
    myFriends(first?: Nullable<number>, after?: Nullable<string>): FriendshipConnection | Promise<FriendshipConnection>;
    getMessages(conversationId: string, first?: Nullable<number>, after?: Nullable<string>): MessageConnection | Promise<MessageConnection>;
}

export interface IMutation {
    generateEmailVerificationToken(email: string): EmailVerificationResponse | Promise<EmailVerificationResponse>;
    verifyEmailToken(): EmailVerificationResponse | Promise<EmailVerificationResponse>;
    register(input: CreateUserInput): RegisterResponse | Promise<RegisterResponse>;
    refreshAccessToken(): RefreshTokenResponse | Promise<RefreshTokenResponse>;
    logout(): LogoutResponse | Promise<LogoutResponse>;
    login(input: LoginUserInput): LoginResponse | Promise<LoginResponse>;
    createPost(input: CreatePostInput): CreatePostResponse | Promise<CreatePostResponse>;
    deletePost(id: string): DeletePostResponse | Promise<DeletePostResponse>;
    updatePost(postId: string, input: UpdatePostInput): UpdatePostResponse | Promise<UpdatePostResponse>;
    likePost(postId: string): string | Promise<string>;
    unlikePost(postId: string): string | Promise<string>;
    sendFriendRequest(recipient: string): string | Promise<string>;
    handleFriendRequest(requesterId: string, action: FriendRequestAction): string | Promise<string>;
    removeFriend(friendId: string): string | Promise<string>;
    createComment(input: CreateCommentInput): string | Promise<string>;
    deleteComment(input: DeleteCommentInput): string | Promise<string>;
    createMessage(conversationId: string, content: string): MessageType | Promise<MessageType>;
    createConversation(receiverId: string): ConversationType | Promise<ConversationType>;
    triggerCommentNotification(userId: string, message: string): string | Promise<string>;
}

export interface ISubscription {
    messageAdded(conversationId: string): MessageType | Promise<MessageType>;
    commentAdded(userId: string): string | Promise<string>;
}

export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
