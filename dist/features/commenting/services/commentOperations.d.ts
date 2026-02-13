import type { LexicalEditor, RangeSelection } from '@payloadcms/richtext-lexical/lexical';
import type { CommentStore } from '../store.js';
import type { Comment, CommentDeletionResult, MarkNodeMapType, Thread } from '../types/core.js';
import type { ICommentOperations } from '../types/services.js';
/**
 * Service for handling comment operations
 */
export declare class CommentOperations implements ICommentOperations {
    /**
     * Delete all comments for the current document
     * @param commentStore The comment store instance
     * @param editor The Lexical editor instance
     * @param markNodeMap Map of mark node keys to IDs
     * @param saveDocumentCallback Optional callback to save the document after deletion
     */
    deleteAllComments(commentStore: CommentStore, editor: LexicalEditor, markNodeMap: MarkNodeMapType, saveDocumentCallback?: () => Promise<boolean | void>): Promise<boolean>;
    /**
     * Delete a comment or thread
     * @param commentStore The comment store instance
     * @param editor The Lexical editor instance
     * @param markNodeMap Map of mark node keys to IDs
     * @param comment The comment or thread to delete
     * @param thread The parent thread (if deleting a comment within a thread)
     * @param saveDocumentCallback Optional callback to save the document after deletion
     * @returns The deletion info or null
     */
    deleteCommentOrThread(commentStore: CommentStore, editor: LexicalEditor, markNodeMap: MarkNodeMapType, comment: Comment | Thread, thread?: Thread, saveDocumentCallback?: () => Promise<boolean | void>): Promise<CommentDeletionResult | null>;
    /**
     * Resolve or unresolve a thread
     */
    resolveThread(commentStore: CommentStore, editor: LexicalEditor, markNodeMap: MarkNodeMapType, thread: Thread, resolved: boolean): Promise<boolean>;
    /**
     * Submit a new comment or thread
     * @param commentStore The comment store instance
     * @param editor The Lexical editor instance
     * @param commentOrThread The comment or thread to add
     * @param isInlineComment Whether this is an inline comment
     * @param thread The parent thread (if adding a comment to a thread)
     * @param selection The current selection (for inline comments)
     * @param saveDocumentCallback Optional callback to save the document after adding the comment
     */
    submitAddComment(commentStore: CommentStore, editor: LexicalEditor, commentOrThread: Comment | Thread, isInlineComment: boolean, thread?: Thread, selection?: null | RangeSelection, saveDocumentCallback?: () => Promise<boolean | void>): Promise<void>;
}
export declare const commentOperations: CommentOperations;
