'use client';
import { commentService } from './api/commentService.js';
import { isCommentDuplicateInThread, isThreadDuplicate } from './utils/comments.js';
import { withErrorHandling } from './utils/errorHandling.js';
import { cloneThread, markDeleted } from './utils/factory.js';
import { getDocumentIdFromUrl } from './utils/url.js';
/**
 * Helper function to trigger onChange listeners
 */ function triggerOnChange(commentStore) {
    const listeners = commentStore._changeListeners;
    for (const listener of listeners){
        listener();
    }
}
/**
 * Store for managing comments and threads
 */ export class CommentStore {
    _changeListeners;
    _comments;
    _editor;
    constructor(editor, userCollectionSlug){
        this._comments = [];
        this._editor = editor;
        this._changeListeners = new Set();
        if (userCollectionSlug) {
            commentService.userCollectionSlug = userCollectionSlug;
        }
    }
    /**
   * Add a comment or thread to the store
   */ addComment(commentOrThread, thread, offset) {
        const nextComments = Array.from(this._comments);
        if (thread !== undefined && commentOrThread.type === 'comment') {
            // Adding a comment to an existing thread
            for(let i = 0; i < nextComments.length; i++){
                const comment = nextComments[i];
                if (comment.type === 'thread' && comment.id === thread.id) {
                    const newThread = cloneThread(comment);
                    // Check if this comment already exists in the thread
                    const isDuplicate = isCommentDuplicateInThread(newThread, commentOrThread);
                    if (!isDuplicate) {
                        nextComments.splice(i, 1, newThread);
                        const insertOffset = offset !== undefined ? offset : newThread.comments.length;
                        newThread.comments.splice(insertOffset, 0, commentOrThread);
                    }
                    break;
                }
            }
        } else {
            // Adding a new thread or standalone comment
            if (commentOrThread.type === 'thread') {
                // Check if this thread already exists
                const isDuplicate = isThreadDuplicate(nextComments, commentOrThread);
                if (!isDuplicate) {
                    const insertOffset = offset !== undefined ? offset : nextComments.length;
                    nextComments.splice(insertOffset, 0, commentOrThread);
                }
            } else {
                // Adding a standalone comment (not in a thread)
                const insertOffset = offset !== undefined ? offset : nextComments.length;
                nextComments.splice(insertOffset, 0, commentOrThread);
            }
        }
        this._comments = nextComments;
        triggerOnChange(this);
    }
    /**
   * Delete all comments and threads from the store
   */ deleteAllComments() {
        this._comments = [];
        triggerOnChange(this);
    }
    /**
   * Delete a comment or thread from the store
   */ deleteCommentOrThread(commentOrThread, thread) {
        const nextComments = Array.from(this._comments);
        let commentIndex = null;
        if (thread !== undefined) {
            for(let i = 0; i < nextComments.length; i++){
                const nextComment = nextComments[i];
                if (nextComment.type === 'thread' && nextComment.id === thread.id) {
                    const newThread = cloneThread(nextComment);
                    nextComments.splice(i, 1, newThread);
                    const threadComments = newThread.comments;
                    commentIndex = threadComments.indexOf(commentOrThread);
                    threadComments.splice(commentIndex, 1);
                    break;
                }
            }
        } else {
            commentIndex = nextComments.indexOf(commentOrThread);
            nextComments.splice(commentIndex, 1);
        }
        this._comments = nextComments;
        triggerOnChange(this);
        if (commentOrThread.type === 'comment') {
            return {
                index: commentIndex,
                markedComment: markDeleted(commentOrThread)
            };
        }
        return null;
    }
    /**
   * Get all comments and threads
   */ getComments() {
        return this._comments;
    }
    /**
   * Load comments for a document from the Payload API
   */ async loadComments(documentId) {
        return withErrorHandling(async ()=>{
            // Clear existing comments
            this._comments = [];
            // Load comments from the API service
            const comments = await commentService.loadComments(documentId);
            // Update the store with the loaded comments
            this._comments = comments;
            // Notify listeners
            triggerOnChange(this);
        }, 'Error loading comments', undefined);
    }
    /**
   * Register a callback to be called when the store changes
   */ registerOnChange(onChange) {
        const changeListeners = this._changeListeners;
        changeListeners.add(onChange);
        return ()=>{
            changeListeners.delete(onChange);
        };
    }
    /**
   * Resolve or unresolve a thread
   */ async resolveThread(threadId, resolved) {
        return withErrorHandling(async ()=>{
            // Update local store
            this._comments = this._comments.map((item)=>{
                if (item.type === 'thread' && item.id === threadId) {
                    const newThread = cloneThread(item);
                    newThread.resolved = resolved;
                    return newThread;
                }
                return item;
            });
            triggerOnChange(this);
            // Persist to API
            return resolved ? await commentService.resolveThread(threadId) : await commentService.unresolveThread(threadId);
        }, `Error ${resolved ? 'resolving' : 'unresolving'} thread ${threadId}`, false);
    }
    /**
   * Save a comment or thread to the Payload API
   */ async saveComment(commentOrThread, thread) {
        return withErrorHandling(async ()=>{
            // Add to local store first for immediate feedback
            this.addComment(commentOrThread, thread);
            // Get the document ID from the URL
            const documentId = getDocumentIdFromUrl();
            // Save to the API service
            await commentService.saveComment(commentOrThread, thread, documentId);
        }, 'Error saving comment', undefined);
    }
}
// Export the hook from its dedicated file
export { useCommentStore } from './hooks/useCommentStore.js';

//# sourceMappingURL=store.js.map