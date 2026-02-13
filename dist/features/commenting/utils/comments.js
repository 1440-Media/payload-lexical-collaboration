'use client';
import { APIUtils } from './api.js';
/**
 * Checks if a comment already exists in a thread
 * @param thread The thread to check
 * @param comment The comment to check for
 * @returns True if the comment already exists in the thread, false otherwise
 */ export function isCommentDuplicateInThread(thread, comment) {
    return thread.comments.some((c)=>c.id === comment.id);
}
/**
 * Checks if a thread already exists in a list of comments
 * @param comments The list of comments to check
 * @param thread The thread to check for
 * @returns True if the thread already exists, false otherwise
 */ export function isThreadDuplicate(comments, thread) {
    return comments.some((c)=>c.type === 'thread' && c.id === thread.id);
}
/**
 * Creates a standard error response object
 * @param message The error message
 * @param details Additional error details
 * @returns A standardized error object
 * @deprecated Use APIUtils.createErrorResponse instead
 */ export function createErrorResponse(message, details) {
    return APIUtils.createErrorResponse(message, details);
}

//# sourceMappingURL=comments.js.map