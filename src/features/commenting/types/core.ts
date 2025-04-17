/**
 * Core comment types for the commenting feature
 */

// Core comment types
export type Comment = {
  author: string
  content: string
  deleted: boolean
  id: string
  timeStamp: number
  type: 'comment'
}

export type Thread = {
  comments: Array<Comment>
  id: string
  quote: string
  type: 'thread'
}

export type Comments = Array<Comment | Thread>

// Operation result types
export type CommentDeletionResult = {
  index: number
  markedComment: Comment
}

// Map types
export type MarkNodeMapType = Map<string, Set<string>>
