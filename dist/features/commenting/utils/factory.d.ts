import type { Comment, Thread } from '../types/core.js';
/**
 * Creates a comment object with the given properties
 */
export declare function createComment(content: string, author: string, id?: string, timeStamp?: number, deleted?: boolean): Comment;
/**
 * Creates a thread object with the given properties
 */
export declare function createThread(quote: string, comments: Array<Comment>, id?: string, resolved?: boolean): Thread;
/**
 * Creates a clone of a thread with a new array of comments
 */
export declare function cloneThread(thread: Thread): Thread;
/**
 * Creates a new comment marked as deleted
 */
export declare function markDeleted(comment: Comment): Comment;
