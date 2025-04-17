/**
 * Service interface types for the commenting feature
 */

import type { LexicalEditor, RangeSelection } from '@payloadcms/richtext-lexical/lexical'

import type { CommentStore } from '../store.js'
import type { Comment, CommentDeletionResult, Comments, MarkNodeMapType, Thread } from './core.js'

/**
 * Interface for the CommentService
 */
export interface ICommentService {
  /**
   * Delete all comments for a document
   */
  deleteAllComments(documentId: string): Promise<boolean>
  
  /**
   * Find a user by email
   */
  findUserByEmail(email: string): Promise<null | string>
  
  /**
   * Load comments for a document
   */
  loadComments(documentId: string): Promise<Comments>

  /**
   * Save a comment or thread
   */
  saveComment(
    commentOrThread: Comment | Thread, 
    thread?: Thread, 
    documentId?: string
  ): Promise<boolean>
}

/**
 * Interface for the DocumentService
 */
export interface IDocumentService {
  /**
   * Check if a document exists
   */
  checkIfDocumentExists(documentId: string): Promise<boolean>
  
  /**
   * Detect the rich text field name in a document
   */
  detectRichTextField(collection: string, docId: string): Promise<string>
  
  /**
   * Save the document content
   */
  saveDocument(editor: LexicalEditor, documentId: string): Promise<boolean>
}

/**
 * Interface for the CommentOperations service
 */
export interface ICommentOperations {
  /**
   * Delete all comments for the current document
   */
  deleteAllComments(
    commentStore: CommentStore,
    editor: LexicalEditor,
    markNodeMap: MarkNodeMapType,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<boolean>
  
  /**
   * Delete a comment or thread
   */
  deleteCommentOrThread(
    commentStore: CommentStore,
    editor: LexicalEditor,
    markNodeMap: MarkNodeMapType,
    comment: Comment | Thread,
    thread?: Thread,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<CommentDeletionResult | null>

  /**
   * Submit a new comment
   */
  submitAddComment(
    commentStore: CommentStore,
    editor: LexicalEditor,
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: null | RangeSelection,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<void>
}
