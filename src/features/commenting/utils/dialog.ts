/**
 * Utility functions for dialog confirmations
 */

/**
 * Confirm deletion of a comment
 * @returns True if confirmed, false otherwise
 */
export function confirmDeleteComment(): boolean {
  return window.confirm('Are you sure you want to delete this comment?')
}

/**
 * Confirm deletion of a thread
 * @returns True if confirmed, false otherwise
 */
export function confirmDeleteThread(): boolean {
  return window.confirm('Are you sure you want to delete this thread and all its comments?')
}

/**
 * Confirm deletion of all comments
 * @returns True if confirmed, false otherwise
 */
export function confirmDeleteAllComments(): boolean {
  return window.confirm('Are you sure you want to delete ALL comments? This action cannot be undone.')
}
