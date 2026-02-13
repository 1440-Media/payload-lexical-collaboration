import type { Comment, Comments, Thread } from '../types/core.js';
import type { ICommentService } from '../types/services.js';
/**
 * Service for handling comment-related API operations
 */
export declare class CommentService implements ICommentService {
    /**
     * Slug of the user collection. Defaults to 'users'.
     */
    userCollectionSlug: string;
    /**
     * Extracts author email from a comment object
     * @param author Author object or string
     * @returns Author email
     */
    private getAuthorEmail;
    /**
     * Helper method to save a comment within a thread
     */
    private saveThreadComment;
    /**
     * Deletes all comments for a document
     * @param documentId Document ID to delete comments for
     * @returns True if successful, false otherwise
     */
    deleteAllComments(documentId: string): Promise<boolean>;
    /**
     * Finds a user by email
     * @param email User email to search for
     * @returns User ID if found, null otherwise
     */
    findUserByEmail(email: string): Promise<null | string>;
    /**
     * Loads comments for a document from the Payload API
     * @param documentId Document ID to load comments for
     * @returns Array of comments and threads
     */
    loadComments(documentId: string): Promise<Comments>;
    /**
     * Resolves a thread by setting resolved: true on all its comments
     */
    resolveThread(threadId: string): Promise<boolean>;
    /**
     * Saves a comment to the Payload API
     * @param commentOrThread Comment or thread to save
     * @param thread Parent thread if saving a comment within a thread
     * @param documentId Document ID to associate the comment with
     */
    saveComment(commentOrThread: Comment | Thread, thread?: Thread, documentId?: string): Promise<boolean>;
    /**
     * Unresolves a thread by setting resolved: false on all its comments
     */
    unresolveThread(threadId: string): Promise<boolean>;
}
export declare const commentService: CommentService;
