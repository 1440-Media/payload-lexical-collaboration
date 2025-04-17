'use client'

import React from 'react'

import type { Thread } from '../../types/core.js'

import { CommentComposer } from '../input/CommentComposer.js'
import { CommentItem } from './CommentItem.js'

type ThreadItemProps = {
  isActive: boolean
  isInteractive: boolean
  onDeleteComment: (commentId: string, thread: Thread) => void
  onDeleteThread: (thread: Thread) => void
  onSubmitReply: (content: string, thread: Thread) => void
  thread: Thread
}

/**
 * Component for rendering a thread with its comments and reply composer
 */
export const ThreadItem: React.FC<ThreadItemProps> = ({
  isActive,
  isInteractive,
  onDeleteComment,
  onDeleteThread,
  onSubmitReply,
  thread,
}) => {
  return (
    <li
      className={`CommentPlugin_CommentsPanel_List_Thread ${
        isInteractive ? 'interactive' : ''
      } ${isActive ? 'active' : ''}`}
    >
      <div className="CommentPlugin_CommentsPanel_List_Thread_QuoteBox">
        <blockquote className="CommentPlugin_CommentsPanel_List_Thread_Quote">
          {'> '}
          <span>{thread.quote}</span>
        </blockquote>
        <button
          aria-label="Delete thread"
          className="CommentPlugin_CommentsPanel_List_DeleteButton"
          onClick={() => onDeleteThread(thread)}
        >
          <i className="delete" />
        </button>
      </div>
      <ul className="CommentPlugin_CommentsPanel_List_Thread_Comments">
        {thread.comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            onDelete={
              !comment.deleted
                ? () => onDeleteComment(comment.id, thread)
                : undefined
            }
          />
        ))}
      </ul>
      <div className="CommentPlugin_CommentsPanel_List_Thread_Editor">
        <CommentComposer
          placeholder="Reply to comment..."
          submitAddComment={(content) => onSubmitReply(content, thread)}
        />
      </div>
    </li>
  )
}
