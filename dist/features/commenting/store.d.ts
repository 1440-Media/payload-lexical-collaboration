import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import type { Comment, CommentDeletionResult, Comments, Thread } from './types/core.js';
import type { CommentStoreInterface } from './types/store.js';
/**
 * Store for managing comments and threads
 */
export declare class CommentStore implements CommentStoreInterface {
    _changeListeners: Set<() => void>;
    _comments: Comments;
    _editor: LexicalEditor;
    constructor(editor: LexicalEditor, userCollectionSlug?: string);
    /**
     * Add a comment or thread to the store
     */
    addComment(commentOrThread: Comment | Thread, thread?: Thread, offset?: number): void;
    /**
     * Delete all comments and threads from the store
     */
    deleteAllComments(): void;
    /**
     * Delete a comment or thread from the store
     */
    deleteCommentOrThread(commentOrThread: Comment | Thread, thread?: Thread): CommentDeletionResult | null;
    /**
     * Get all comments and threads
     */
    getComments(): Comments;
    /**
     * Load comments for a document from the Payload API
     */
    loadComments(documentId: string): Promise<void>;
    /**
     * Register a callback to be called when the store changes
     */
    registerOnChange(onChange: () => void): () => void;
    /**
     * Resolve or unresolve a thread
     */
    resolveThread(threadId: string, resolved: boolean): Promise<boolean>;
    /**
     * Save a comment or thread to the Payload API
     */
    saveComment(commentOrThread: Comment | Thread, thread?: Thread): Promise<void>;
}
export { useCommentStore } from './hooks/useCommentStore.js';
