/**
 * API-related types for the commenting feature
 */

/**
 * Represents a range selection in the editor
 */
export type CommentRange = {
  endContainer?: string
  endOffset: number
  startContainer?: string
  startOffset: number
}

/**
 * Standard Payload CMS API response format
 */
export type PayloadAPIResponse<T> = {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: null | number
  page: number
  pagingCounter: number
  prevPage: null | number
  totalDocs: number
  totalPages: number
}

/**
 * Comment entity as returned from the Payload API
 */
export type CommentAPIEntity = {
  author: { email: string; id: string } | string
  content: string
  createdAt: string
  documentId: string
  id: string
  quote?: string
  range?: CommentRange
  resolved: boolean
  threadId?: string
  updatedAt: string
}

/**
 * User entity as returned from the Payload API
 */
export type UserAPIEntity = {
  email: string
  id: string
  // other user fields as needed
}

/**
 * Request to save a comment
 */
export type SaveCommentRequest = {
  author: string
  content: string
  documentId: string
  quote?: string
  range?: CommentRange
  threadId?: string
}

/**
 * Standard error response
 */
export type ErrorResponse = {
  details?: Record<string, unknown>
  error: string
}

/**
 * API endpoints used in the commenting feature
 */
export const API_ENDPOINTS = {
  COMMENTS: '/api/lexical-collaboration-plugin-comments',
}
