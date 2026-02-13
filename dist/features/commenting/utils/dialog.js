/**
 * Utility functions for dialog confirmations
 */ /**
 * Confirm deletion of a comment
 * @returns True if confirmed, false otherwise
 */ export function confirmDeleteComment() {
    return window.confirm('Are you sure you want to delete this comment?');
}
/**
 * Confirm deletion of a thread
 * @returns True if confirmed, false otherwise
 */ export function confirmDeleteThread() {
    return window.confirm('Are you sure you want to delete this thread and all its comments?');
}
/**
 * Confirm deletion of all comments
 * @returns True if confirmed, false otherwise
 */ export function confirmDeleteAllComments() {
    return window.confirm('Are you sure you want to delete ALL comments? This action cannot be undone.');
}

//# sourceMappingURL=dialog.js.map