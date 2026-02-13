/**
 * Component prop types for the commenting feature
 */

import type { LexicalEditor, NodeKey, RangeSelection } from '@payloadcms/richtext-lexical/lexical'

import type { Comment, Comments, MarkNodeMapType, Thread } from './core.js'

/**
 * Props for the CommentPlugin component
 */
export type CommentPluginProps = {
  /**
   * Current user's identifier (typically email)
   */
  currentUser: string

  /**
   * ID of the document to load comments for
   * @default 'default'
   */
  documentId?: string

  /**
   * Slug of the user collection (e.g. 'editors'). Defaults to 'users'.
   */
  userCollectionSlug?: string
}

/**
 * Props for the CommentInputBox component
 */
export type CommentInputBoxProps = {
  /**
   * Author of the comment (typically user email)
   */
  author: string
  
  /**
   * Function to cancel adding a comment
   */
  cancelAddComment: () => void
  
  /**
   * The Lexical editor instance
   */
  editor: LexicalEditor
  
  /**
   * Function to set the active anchor key
   */
  setActiveAnchorKey: (key: NodeKey | null) => void
  
  /**
   * Function to show/hide the comment input
   */
  setShowCommentInput: (show: boolean) => void
  
  /**
   * Function to submit a new comment
   */
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: null | RangeSelection,
  ) => Promise<void>
}

/**
 * Props for the CommentsPanel component
 */
export type CommentsPanelProps = {
  /**
   * IDs of active comments
   */
  activeIDs: Array<string>
  
  /**
   * List of comments and threads
   */
  comments: Comments
  
  /**
   * Current user's identifier (typically email)
   */
  currentUser: string
  
  /**
   * Function to delete all comments
   */
  deleteAllComments?: () => Promise<boolean>
  
  /**
   * Function to delete a comment or thread
   */
  deleteCommentOrThread: (
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ) => void
  
  /**
   * Map of mark node keys to IDs
   */
  markNodeMap: MarkNodeMapType
  
  /**
   * Function to submit a new comment
   */
  submitAddComment: (
    commentOrThread: Comment | Thread,
    isInlineComment: boolean,
    thread?: Thread,
    selection?: null | RangeSelection,
  ) => Promise<void>
}

/**
 * Props for the AddCommentBox component
 */
export type AddCommentBoxProps = {
  /**
   * Key of the anchor node
   */
  anchorKey: NodeKey
  
  /**
   * The Lexical editor instance
   */
  editor: LexicalEditor
  
  /**
   * Function to add a comment
   */
  onAddComment: () => void
}

/**
 * Props for the CommentItem component
 */
export type CommentItemProps = {
  /**
   * The comment to display
   */
  comment: Comment
  
  /**
   * Function to delete a comment
   */
  onDelete?: () => void
}

/**
 * Props for the ThreadItem component
 */
export type ThreadItemProps = {
  /**
   * Whether the thread is active
   */
  isActive: boolean
  
  /**
   * Whether the thread is interactive
   */
  isInteractive: boolean
  
  /**
   * Function to delete a comment
   */
  onDeleteComment: (commentId: string, thread: Thread) => void
  
  /**
   * Function to delete a thread
   */
  onDeleteThread: (thread: Thread) => void
  
  /**
   * Function to submit a reply
   */
  onSubmitReply: (content: string, thread: Thread) => void
  
  /**
   * The thread to display
   */
  thread: Thread
}

/**
 * Props for the TimeAgo component
 */
export type TimeAgoProps = {
  /**
   * Timestamp to display relative time for
   */
  timestamp: number
}

/**
 * Props for the CommentComposer component
 */
export type CommentComposerProps = {
  /**
   * Placeholder text for the textarea
   */
  placeholder?: string
  
  /**
   * Function to submit a new comment
   */
  submitAddComment: (content: string) => void
}

/**
 * Feature prop types
 */
export type CommentClientFeatureProps = {
  /**
   * Whether to enable the commenting feature
   * @default true
   */
  enabled?: boolean

  /**
   * Slug of the user collection (e.g. 'editors'). Defaults to 'users'.
   */
  userCollectionSlug?: string
}
