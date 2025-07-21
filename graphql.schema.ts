
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
    first?: Nullable<number>;
    after?: Nullable<string>;
    search?: Nullable<string>;
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
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

export interface DeleteMessageInput {
    messageId: string;
    conversationId: string;
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

export interface ChangePasswordResponse {
    message: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface VerifyResetPasswordTokenResponse {
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

export interface CreatePostResponse {
    message: string;
    post: PostType;
}

export interface PageInfo {
    endCursor?: Nullable<string>;
    hasNextPage: boolean;
}

export interface PostEdge {
    node: PostType;
    cursor: string;
}

export interface PostConnection {
    edges: PostEdge[];
    pageInfo: PageInfo;
}

export interface DeletePostResponse {
    message: string;
}

export interface UpdatePostResponse {
    message: string;
    post: PostType;
}

export interface CommentType {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    content: string;
    parentCommentId?: Nullable<string>;
}

export interface CommentEdge {
    node: CommentType;
    cursor: string;
}

export interface CommentConnection {
    edges: CommentEdge[];
    pageInfo: PageInfo;
}

export interface FriendshipType {
    id: string;
    requester: string;
    requesterName: string;
    recipient: string;
    recipientName: string;
    requesterAvatar?: Nullable<string>;
    recipientAvatar?: Nullable<string>;
    status: FriendshipStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface FriendshipEdge {
    node: FriendshipType;
    cursor: string;
}

export interface FriendshipConnection {
    edges: FriendshipEdge[];
    pageInfo: PageInfo;
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
    messageId: string;
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
    myProfile(): UserType | Promise<UserType>;
    posts(input?: Nullable<PaginationInput>): PostConnection | Promise<PostConnection>;
    myPosts(input?: Nullable<PaginationInput>): PostConnection | Promise<PostConnection>;
    getComments(postId: string, input: PaginationInput): CommentConnection | Promise<CommentConnection>;
    myFriends(first?: Nullable<number>, after?: Nullable<string>): FriendshipConnection | Promise<FriendshipConnection>;
    myFriendRequests(first?: Nullable<number>, after?: Nullable<string>): FriendshipConnection | Promise<FriendshipConnection>;
    getMessages(conversationId: string, first?: Nullable<number>, after?: Nullable<string>): MessageConnection | Promise<MessageConnection>;
}

export interface IMutation {
    verifyResetPasswordToken(newPassword: string): VerifyResetPasswordTokenResponse | Promise<VerifyResetPasswordTokenResponse>;
    forgotPassword(email: string): ForgotPasswordResponse | Promise<ForgotPasswordResponse>;
    generateEmailVerificationToken(email: string): EmailVerificationResponse | Promise<EmailVerificationResponse>;
    changePassword(input: ChangePasswordInput): ChangePasswordResponse | Promise<ChangePasswordResponse>;
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
    createComment(input: CreateCommentInput): string | Promise<string>;
    deleteComment(input: DeleteCommentInput): string | Promise<string>;
    sendFriendRequest(recipient: string): string | Promise<string>;
    handleFriendRequest(requesterId: string, action: FriendRequestAction): string | Promise<string>;
    removeFriend(friendId: string): string | Promise<string>;
    createMessage(conversationId: string, content: string): MessageType | Promise<MessageType>;
    deleteMessage(input: DeleteMessageInput): string | Promise<string>;
    createConversation(receiverId: string): ConversationType | Promise<ConversationType>;
    triggerCommentNotification(userId: string, message: string): string | Promise<string>;
}

export interface ISubscription {
    messageAdded(conversationId: string): MessageType | Promise<MessageType>;
    messageDeleted(conversationId: string): MessageType | Promise<MessageType>;
    commentAdded(userId: string): string | Promise<string>;
}

export type DateTime = any;
export type Upload = any;
type Nullable<T> = T | null;
