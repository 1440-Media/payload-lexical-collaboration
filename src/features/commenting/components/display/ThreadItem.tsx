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
  onResolveThread: () => void
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
  onResolveThread,
  onSubmitReply,
  thread,
}) => {
  const isResolved = thread.resolved || false

  return (
    <li
      className={`CommentPlugin_CommentsPanel_List_Thread ${
        isInteractive ? 'interactive' : ''
      } ${isActive ? 'active' : ''} ${isResolved ? 'resolved' : ''}`}
    >
      <div className="CommentPlugin_CommentsPanel_List_Thread_QuoteBox">
        <blockquote className="CommentPlugin_CommentsPanel_List_Thread_Quote">
          {'> '}
          <span>{thread.quote}</span>
        </blockquote>
        <button
          aria-label={isResolved ? 'Unresolve thread' : 'Resolve thread'}
          className="CommentPlugin_CommentsPanel_List_ResolveButton"
          onClick={onResolveThread}
          title={isResolved ? 'Unresolve thread' : 'Resolve thread'}
          type="button"
        >
          <i className={isResolved ? 'unresolve' : 'resolve'} />
        </button>
        {!isResolved && (
          <button
            aria-label="Delete thread"
            className="CommentPlugin_CommentsPanel_List_DeleteButton"
            onClick={() => onDeleteThread(thread)}
            type="button"
          >
            <i className="delete" />
          </button>
        )}
      </div>
      <ul className="CommentPlugin_CommentsPanel_List_Thread_Comments">
        {thread.comments.map((comment) => (
          <CommentItem
            comment={comment}
            key={comment.id}
            onDelete={
              !comment.deleted && !isResolved
                ? () => onDeleteComment(comment.id, thread)
                : undefined
            }
          />
        ))}
      </ul>
      {!isResolved && (
        <div className="CommentPlugin_CommentsPanel_List_Thread_Editor">
          <CommentComposer
            placeholder="Reply to comment..."
            submitAddComment={(content) => onSubmitReply(content, thread)}
          />
        </div>
      )}
    </li>
  )
}
