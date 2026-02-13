'use client'

import type { LexicalEditor, RangeSelection } from '@payloadcms/richtext-lexical/lexical'

import { useCallback } from 'react'

import type { CommentStore } from '../store.js'
import type { Comment, MarkNodeMapType, Thread } from '../types/core.js'
import type { CommentOperationsResult } from '../types/hooks.js'

import { commentOperations } from '../services/commentOperations.js'


/**
 * Hook for handling comment operations
 * @param commentStore The comment store instance
 * @param editor The Lexical editor instance
 * @param markNodeMap Map of mark node keys to IDs
 * @param saveDocument Function to save the document
 * @returns Object with functions to handle comment operations
 */
export function useCommentOperations(
  commentStore: CommentStore,
  editor: LexicalEditor,
  markNodeMap: MarkNodeMapType,
  saveDocument: () => Promise<boolean | void>
): CommentOperationsResult {
  // Delete a comment or thread
  const deleteCommentOrThread = useCallback(
    (comment: Comment | Thread, thread?: Thread) => {
      return commentOperations.deleteCommentOrThread(
        commentStore,
        editor,
        markNodeMap,
        comment,
        thread,
        saveDocument
      )
    },
    [commentStore, editor, markNodeMap, saveDocument]
  )

  // Submit a new comment
  const submitAddComment = useCallback(
    (
      commentOrThread: Comment | Thread,
      isInlineComment: boolean,
      thread?: Thread,
      selection?: null | RangeSelection,
    ) => {
      return commentOperations.submitAddComment(
        commentStore,
        editor,
        commentOrThread,
        isInlineComment,
        thread,
        selection,
        saveDocument
      )
    },
    [commentStore, editor, saveDocument]
  )

  // Resolve or unresolve a thread
  const resolveThread = useCallback(
    (thread: Thread, resolved: boolean) => {
      return commentOperations.resolveThread(
        commentStore,
        editor,
        markNodeMap,
        thread,
        resolved,
      )
    },
    [commentStore, editor, markNodeMap]
  )

  // Delete all comments
  const deleteAllComments = useCallback(
    () => {
      return commentOperations.deleteAllComments(
        commentStore,
        editor,
        markNodeMap,
        saveDocument
      )
    },
    [commentStore, editor, markNodeMap, saveDocument]
  )

  return {
    deleteAllComments,
    deleteCommentOrThread,
    resolveThread,
    submitAddComment,
  }
}
