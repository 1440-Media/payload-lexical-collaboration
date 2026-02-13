/**
 * Core comment types for the commenting feature
 */
export type Comment = {
    author: string;
    content: string;
    deleted: boolean;
    id: string;
    timeStamp: number;
    type: 'comment';
};
export type Thread = {
    comments: Array<Comment>;
    id: string;
    quote: string;
    resolved?: boolean;
    type: 'thread';
};
export type Comments = Array<Comment | Thread>;
export type CommentDeletionResult = {
    index: number;
    markedComment: Comment;
};
export type MarkNodeMapType = Map<string, Set<string>>;
