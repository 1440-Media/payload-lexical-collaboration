'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Comment, Thread } from '../../types/core.js'
import type { CommentsPanelProps } from '../../types/props.js'

import { confirmDeleteAllComments, confirmDeleteComment, confirmDeleteThread } from '../../utils/dialog.js'
import { createComment } from '../../utils/factory.js'
import { CommentItem } from '../display/CommentItem.js'
import { ThreadItem } from '../display/ThreadItem.js'

/**
 * Panel for displaying and managing comments and threads
 */
export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  activeIDs,
  comments,
  currentUser,
  deleteAllComments,
  deleteCommentOrThread,
  markNodeMap,
  submitAddComment,
}) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false)
  const isEmpty = comments.length === 0

  const handleDeleteComment = (commentId: string, thread?: Thread) => {
    if (!confirmDeleteComment()) {return}
    
    // Find the comment in the thread or standalone
    const comment = thread 
      ? thread.comments.find(c => c.id === commentId)
      : comments.find(c => c.id === commentId && c.type === 'comment') as Comment | undefined
    
    if (comment) {
      deleteCommentOrThread(comment, thread)
    }
  }

  const handleDeleteThread = (thread: Thread) => {
    if (confirmDeleteThread()) {
      deleteCommentOrThread(thread)
    }
  }

  const handleSubmitReply = (content: string, thread: Thread) => {
    if (content.trim()) {
      submitAddComment(createComment(content, currentUser), false, thread)
    }
  }

  const toggleDeleteDropdown = () => {
    setShowDeleteDropdown(!showDeleteDropdown)
  }

  const handleDeleteAllComments = () => {
    if (deleteAllComments && confirmDeleteAllComments()) {
      deleteAllComments()
      setShowDeleteDropdown(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.CommentPlugin_CommentsPanel_DeleteContainer')) {
        setShowDeleteDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="CommentPlugin_CommentsPanel">
      <div className="CommentPlugin_CommentsPanel_Header">
        <h2 className="CommentPlugin_CommentsPanel_Heading">Comments</h2>
        {!isEmpty && deleteAllComments && (
          <div className="CommentPlugin_CommentsPanel_DeleteContainer">
            <button
              aria-label="Delete options"
              className="CommentPlugin_CommentsPanel_DeleteIcon"
              onClick={toggleDeleteDropdown}
            >
              <i className="delete" />
            </button>
            {showDeleteDropdown && (
              <div className="CommentPlugin_CommentsPanel_DeleteDropdown">
                <button
                  aria-label="Delete all comments"
                  className="CommentPlugin_CommentsPanel_DeleteAllButton"
                  onClick={handleDeleteAllComments}
                >
                  Delete All
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isEmpty ? (
        <div className="CommentPlugin_CommentsPanel_Empty">No Comments</div>
      ) : (
        <ul className="CommentPlugin_CommentsPanel_List" ref={listRef}>
          {comments.map((commentOrThread) => {
            const id = commentOrThread.id
            
            if (commentOrThread.type === 'thread') {
              const thread = commentOrThread
              return (
                <ThreadItem
                  isActive={activeIDs.includes(id)}
                  isInteractive={markNodeMap.has(id)}
                  key={id}
                  onDeleteComment={(commentId) => handleDeleteComment(commentId, thread)}
                  onDeleteThread={handleDeleteThread}
                  onSubmitReply={(content) => handleSubmitReply(content, thread)}
                  thread={thread}
                />
              )
            }
            
            // Handle standalone comments (not in a thread)
            return (
              <CommentItem
                comment={commentOrThread}
                key={id}
                onDelete={
                  !commentOrThread.deleted
                    ? () => handleDeleteComment(commentOrThread.id)
                    : undefined
                }
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}
