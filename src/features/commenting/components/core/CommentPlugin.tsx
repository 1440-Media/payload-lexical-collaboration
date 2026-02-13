'use client'

import type { NodeKey } from '@payloadcms/richtext-lexical/lexical'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CommentPluginProps } from '../../types/props.js'

import { useCommentCommands } from '../../hooks/editor/useCommentCommands.js'
import { useCommentMarks } from '../../hooks/editor/useCommentMarks.js'
import { useCommentOperations } from '../../hooks/useCommentOperations.js'
import { useDocumentOperations } from '../../hooks/useDocumentOperations.js'
import { CommentStore, useCommentStore } from '../../store.js'
import { AddCommentBox } from '../input/AddCommentBox.js'
import { CommentInputBox } from '../input/CommentInputBox.js'
import { CommentsPanel } from './CommentPanel.js'
import '../ui/CommentPlugin.css'

/**
 * CommentPlugin component for the Lexical editor
 * 
 * This component provides commenting functionality for the Lexical editor,
 * including adding, viewing, and deleting comments.
 */
export const CommentPlugin: React.FC<CommentPluginProps> = ({
  currentUser,
  documentId = 'default',
  userCollectionSlug,
}) => {
  // Editor context
  const [editor] = useLexicalComposerContext()

  // Comment store
  const commentStore = useMemo(() => new CommentStore(editor, userCollectionSlug), [editor, userCollectionSlug])
  const comments = useCommentStore(commentStore)
  
  // UI state
  const [activeAnchorKey, setActiveAnchorKey] = useState<NodeKey | null>(null)
  const [activeIDs, setActiveIDs] = useState<Array<string>>([])
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [showComments, setShowComments] = useState(false)
  
  // Custom hooks
  const markNodeMap = useCommentMarks(editor, setActiveIDs, setActiveAnchorKey)
  const { isDocumentSaved, saveDocument } = useDocumentOperations(editor, documentId)
  const { deleteAllComments, deleteCommentOrThread, submitAddComment } = useCommentOperations(
    commentStore, 
    editor, 
    markNodeMap, 
    saveDocument
  )
  const { cancelAddComment, onAddComment, toggleComments } = useCommentCommands(
    editor,
    setShowCommentInput,
    setShowComments,
    showComments,
    showCommentInput,
    setActiveAnchorKey
  )

  // Highlight active comments
  useEffect(() => {
    const changedElems: Array<HTMLElement> = []
    for (let i = 0; i < activeIDs.length; i++) {
      const id = activeIDs[i]
      const keys = markNodeMap.get(id)
      if (keys !== undefined) {
        for (const key of keys) {
          const elem = editor.getElementByKey(key)
          if (elem !== null) {
            elem.classList.add('selected')
            changedElems.push(elem)
            setShowComments(true)
          }
        }
      }
    }
    return () => {
      for (let i = 0; i < changedElems.length; i++) {
        const changedElem = changedElems[i]
        changedElem.classList.remove('selected')
      }
    }
  }, [activeIDs, editor, markNodeMap])

  // Load comments when documentId changes
  useEffect(() => {
    if (documentId) {
      commentStore.loadComments(documentId)
    }
  }, [commentStore, documentId])

  return (
    <>
      {isDocumentSaved && showCommentInput &&
        createPortal(
          <CommentInputBox
            author={currentUser}
            cancelAddComment={cancelAddComment}
            editor={editor}
            setActiveAnchorKey={setActiveAnchorKey}
            setShowCommentInput={setShowCommentInput}
            submitAddComment={submitAddComment}
          />,
          document.body,
        )}
      {isDocumentSaved && activeAnchorKey !== null &&
        !showCommentInput &&
        createPortal(
          <AddCommentBox
            anchorKey={activeAnchorKey}
            editor={editor}
            onAddComment={onAddComment}
          />,
          document.body,
        )}
      {isDocumentSaved && createPortal(
        <button
          aria-label={showComments ? 'Hide Comments' : 'Show Comments'}
          className={`CommentPlugin_ShowCommentsButton ${
            showComments ? 'active' : ''
          }`}
          onClick={toggleComments}
          title={showComments ? 'Hide Comments' : 'Show Comments'}
        >
          <i className="comments" />
        </button>,
        document.body,
      )}
      {isDocumentSaved && showComments &&
        createPortal(
          <CommentsPanel
            activeIDs={activeIDs}
            comments={comments}
            currentUser={currentUser}
            deleteAllComments={deleteAllComments}
            deleteCommentOrThread={deleteCommentOrThread}
            markNodeMap={markNodeMap}
            submitAddComment={submitAddComment}
          />,
          document.body,
        )}
    </>
  )
}
