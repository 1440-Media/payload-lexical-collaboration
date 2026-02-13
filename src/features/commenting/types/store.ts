/**
 * Store interface types for the commenting feature
 */

import type { Comment, CommentDeletionResult, Comments, Thread } from './core.js'

/**
 * Interface for the CommentStore
 */
export interface CommentStoreInterface {
  /**
   * Add a comment or thread to the store
   */
  addComment(
    commentOrThread: Comment | Thread,
    thread?: Thread,
    offset?: number,
  ): void
  
  /**
   * Delete all comments and threads from the store
   */
  deleteAllComments(): void
  
  /**
   * Delete a comment or thread from the store
   */
  deleteCommentOrThread(
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ): CommentDeletionResult | null
  
  /**
   * Get all comments and threads
   */
  getComments(): Comments
  
  /**
   * Load comments for a document from the Payload API
   */
  loadComments(documentId: string): Promise<void>
  
  /**
   * Register a callback to be called when the store changes
   */
  registerOnChange(onChange: () => void): () => void

  /**
   * Resolve or unresolve a thread
   */
  resolveThread(threadId: string, resolved: boolean): Promise<boolean>
  
  /**
   * Save a comment or thread to the Payload API
   */
  saveComment(
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ): Promise<void>
}
