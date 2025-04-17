'use client'

import type { LexicalEditor, RangeSelection } from '@payloadcms/richtext-lexical/lexical'
import type {
  MarkNode} from '@payloadcms/richtext-lexical/lexical/mark';

import {
  $getNodeByKey,
  $isRangeSelection,
} from '@payloadcms/richtext-lexical/lexical'
import {
  $isMarkNode,
  $unwrapMarkNode,
  $wrapSelectionInMarkNode
} from '@payloadcms/richtext-lexical/lexical/mark'

import type { CommentStore } from '../store.js'
import type { CommentAPIEntity } from '../types/api.js'
import type { Comment, CommentDeletionResult, MarkNodeMapType, Thread } from '../types/core.js'
import type { ICommentOperations } from '../types/services.js'

import { commentService } from '../api/commentService.js'
import { API_ENDPOINTS } from '../types/api.js'
import { APIUtils } from '../utils/api.js'
import { withErrorHandling } from '../utils/errorHandling.js'
import { getDocumentIdFromUrl } from '../utils/url.js'

/**
 * Service for handling comment operations
 */
export class CommentOperations implements ICommentOperations {
  /**
   * Delete all comments for the current document
   * @param commentStore The comment store instance
   * @param editor The Lexical editor instance
   * @param markNodeMap Map of mark node keys to IDs
   * @param saveDocumentCallback Optional callback to save the document after deletion
   */
  async deleteAllComments(
    commentStore: CommentStore,
    editor: LexicalEditor,
    markNodeMap: MarkNodeMapType,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<boolean> {
    return withErrorHandling(
      async () => {
        // Get the document ID from the URL
        const documentId = getDocumentIdFromUrl()
        
        // Delete all comments from the database
        const success = await commentService.deleteAllComments(documentId)
        
        if (success) {
          // Clear comments from the store
          commentStore.deleteAllComments()
          
          // Remove all comment marks from the editor
          editor.update(() => {
            // Collect all mark node keys
            const allMarkNodeKeys = new Set<string>()
            markNodeMap.forEach((keys) => {
              keys.forEach((key) => allMarkNodeKeys.add(key))
            })
            
            // Unwrap all mark nodes
            allMarkNodeKeys.forEach((key) => {
              const node = $getNodeByKey(key)
              if ($isMarkNode(node)) {
                $unwrapMarkNode(node)
              }
            })
          })
          
          // Save the document after removing all comment marks
          if (saveDocumentCallback) {
            await saveDocumentCallback()
          }
        }
        
        return success
      },
      'Error deleting all comments',
      false
    )
  }

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
  async deleteCommentOrThread(
    commentStore: CommentStore,
    editor: LexicalEditor,
    markNodeMap: MarkNodeMapType,
    comment: Comment | Thread,
    thread?: Thread,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<CommentDeletionResult | null> {
    return withErrorHandling(
      async () => {
        if (comment.type === 'comment') {
          const deletionInfo = commentStore.deleteCommentOrThread(
            comment,
            thread,
          )
          if (!deletionInfo) {
            return null
          }
          const { index, markedComment } = deletionInfo
          
          // Mark as deleted in the database using Payload's built-in REST API
          await APIUtils.patch(`${API_ENDPOINTS.COMMENTS}/${comment.id}`, {
            resolved: true, // Use resolved field to mark as deleted
          })
          
          commentStore.addComment(markedComment, thread, index)
          return deletionInfo
        } else {
          commentStore.deleteCommentOrThread(comment)
          
          // Mark thread as resolved in the database using Payload's built-in REST API
          // Update all comments with this threadId
          const threadId = comment.id
          const params = { 'where[threadId][equals]': threadId }
          const data = await APIUtils.getPaginated<CommentAPIEntity>(API_ENDPOINTS.COMMENTS, params)
          
          // For each comment in the thread, mark it as resolved
          if (data.docs && Array.isArray(data.docs)) {
            const updatePromises = data.docs.map(async (threadComment: CommentAPIEntity) => {
              return APIUtils.patch(`${API_ENDPOINTS.COMMENTS}/${threadComment.id}`, {
                resolved: true,
              })
            })
            
            // Wait for all updates to complete
            await Promise.all(updatePromises)
          }
          
          // Remove ids from associated marks
          const id = thread !== undefined ? thread.id : comment.id
          const markNodeKeys = markNodeMap.get(id)
          
          if (markNodeKeys !== undefined) {
            // Do async to avoid causing a React infinite loop
            setTimeout(async () => {
              editor.update(() => {
                for (const key of markNodeKeys) {
                  const node: MarkNode | null = $getNodeByKey(key)
                  if ($isMarkNode(node)) {
                    node.deleteID(id)
                    if (node.getIDs().length === 0) {
                      $unwrapMarkNode(node)
                    }
                  }
                }
              })
              
              // Save the document after removing comment marks
              if (saveDocumentCallback) {
                await saveDocumentCallback()
              }
            })
          }
          
          return null
        }
      },
      'Error deleting comment or thread',
      null
    )
  }

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
  async submitAddComment(
    commentStore: CommentStore,
    editor: LexicalEditor,
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: null | RangeSelection,
    saveDocumentCallback?: () => Promise<boolean | void>
  ): Promise<void> {
    return withErrorHandling(
      async () => {
        // Use saveComment instead of addComment to persist to database
        await commentStore.saveComment(commentOrThread, thread)
        
        if (isInlineComment && selection) {
          editor.update(() => {
            if ($isRangeSelection(selection)) {
              const isBackward = selection.isBackward()
              const id = commentOrThread.id

              // Wrap content in a MarkNode
              $wrapSelectionInMarkNode(selection, isBackward, id)
            }
          })
          
          // Save the document after adding a comment
          if (saveDocumentCallback) {
            await saveDocumentCallback()
          }
        }
      },
      'Error submitting comment',
      undefined
    )
  }
}

// Export a singleton instance
export const commentOperations = new CommentOperations()
