'use client';
import { API_ENDPOINTS } from '../types/api.js';
import { APIUtils } from '../utils/api.js';
import { isCommentDuplicateInThread } from '../utils/comments.js';
import { withErrorHandling } from '../utils/errorHandling.js';
import { createComment, createThread } from '../utils/factory.js';
import { generatedIds } from '../utils/id.js';
import { getDocumentIdFromUrl } from '../utils/url.js';
/**
 * Service for handling comment-related API operations
 */ export class CommentService {
    /**
   * Slug of the user collection. Defaults to 'users'.
   */ userCollectionSlug = 'users';
    /**
   * Extracts author email from a comment object
   * @param author Author object or string
   * @returns Author email
   */ getAuthorEmail(author) {
        if (!author) {
            return 'Unknown';
        }
        if (typeof author === 'string') {
            return author;
        }
        return author.email || 'Unknown';
    }
    /**
   * Helper method to save a comment within a thread
   */ async saveThreadComment(comment, thread, documentId) {
        return withErrorHandling(async ()=>{
            // Find the user ID by email
            const userId = await this.findUserByEmail(comment.author);
            if (!userId) {
                console.error(`Could not find user with email: ${comment.author}`);
                return false;
            }
            const commentData = {
                author: userId,
                content: comment.content,
                documentId,
                quote: thread.quote,
                range: undefined,
                threadId: thread.id
            };
            // Save the comment
            await APIUtils.post(API_ENDPOINTS.COMMENTS, commentData);
            return true;
        }, `Error saving thread comment for thread ${thread.id}`, false);
    }
    /**
   * Deletes all comments for a document
   * @param documentId Document ID to delete comments for
   * @returns True if successful, false otherwise
   */ async deleteAllComments(documentId) {
        return withErrorHandling(async ()=>{
            // Fetch all comments for this document
            const params = {
                'limit': '100',
                'where[documentId][equals]': documentId
            };
            const data = await APIUtils.getPaginated(API_ENDPOINTS.COMMENTS, params);
            // Delete all comments
            const updatePromises = data.docs.map(async (comment)=>{
                return APIUtils.delete(`${API_ENDPOINTS.COMMENTS}/${comment.id}`);
            });
            // Wait for all updates to complete
            await Promise.all(updatePromises);
            return true;
        }, 'Error deleting all comments', false);
    }
    /**
   * Finds a user by email
   * @param email User email to search for
   * @returns User ID if found, null otherwise
   */ async findUserByEmail(email) {
        return withErrorHandling(async ()=>{
            const params = {
                'where[email][equals]': email
            };
            const userData = await APIUtils.getPaginated(`/api/${this.userCollectionSlug}`, params);
            // Get the first user that matches the email
            return userData.docs && userData.docs.length > 0 ? userData.docs[0].id : null;
        }, `Error finding user with email ${email}`, null);
    }
    /**
   * Loads comments for a document from the Payload API
   * @param documentId Document ID to load comments for
   * @returns Array of comments and threads
   */ async loadComments(documentId) {
        return withErrorHandling(async ()=>{
            // Clear the set of generated IDs to avoid conflicts with new IDs
            generatedIds.clear();
            // Fetch comments from Payload API
            const params = {
                'depth': '2',
                'where[documentId][equals]': documentId
            };
            const data = await APIUtils.getPaginated(API_ENDPOINTS.COMMENTS, params);
            // Group comments by threadId
            const threadMap = new Map();
            const threadResolvedMap = new Map();
            // First pass: group comments by threadId
            data.docs.forEach((comment)=>{
                if (!comment.threadId) {
                    return;
                }
                if (!threadMap.has(comment.threadId)) {
                    threadMap.set(comment.threadId, []);
                    threadResolvedMap.set(comment.threadId, true);
                }
                // Track resolved status: thread is resolved only if ALL non-deleted comments are resolved
                if (!comment.resolved) {
                    threadResolvedMap.set(comment.threadId, false);
                }
                // Get author email
                const authorEmail = this.getAuthorEmail(comment.author);
                // Add the comment ID to the set of generated IDs
                if (comment.id) {
                    generatedIds.add(comment.id);
                }
                const commentObj = createComment(comment.content, authorEmail, comment.id, comment.createdAt ? new Date(comment.createdAt).getTime() : undefined, comment.resolved || false);
                // Check if this comment is already in the thread
                const existingComments = threadMap.get(comment.threadId);
                const threadObj = {
                    id: comment.threadId,
                    type: 'thread',
                    comments: existingComments,
                    quote: ''
                };
                if (!isCommentDuplicateInThread(threadObj, commentObj)) {
                    existingComments.push(commentObj);
                }
            });
            // Second pass: create threads
            const comments = [];
            threadMap.forEach((threadComments, threadId)=>{
                // Find the first comment to get the quote
                const firstComment = threadComments.find((c)=>!c.deleted);
                if (!firstComment) {
                    return;
                }
                const commentData = data.docs.find((c)=>c.id === firstComment.id);
                const quote = commentData?.quote || '';
                // Add the thread ID to the set of generated IDs
                generatedIds.add(threadId);
                const resolved = threadResolvedMap.get(threadId) || false;
                const thread = createThread(quote, threadComments, threadId, resolved);
                comments.push(thread);
            });
            return comments;
        }, 'Error loading comments', []);
    }
    /**
   * Resolves a thread by setting resolved: true on all its comments
   */ async resolveThread(threadId) {
        return withErrorHandling(async ()=>{
            const params = {
                'where[threadId][equals]': threadId
            };
            const data = await APIUtils.getPaginated(API_ENDPOINTS.COMMENTS, params);
            const updatePromises = data.docs.map(async (comment)=>{
                return APIUtils.patch(`${API_ENDPOINTS.COMMENTS}/${comment.id}`, {
                    resolved: true
                });
            });
            await Promise.all(updatePromises);
            return true;
        }, `Error resolving thread ${threadId}`, false);
    }
    /**
   * Saves a comment to the Payload API
   * @param commentOrThread Comment or thread to save
   * @param thread Parent thread if saving a comment within a thread
   * @param documentId Document ID to associate the comment with
   */ async saveComment(commentOrThread, thread, documentId) {
        return withErrorHandling(async ()=>{
            // Register IDs to prevent duplicates
            if (commentOrThread.type === 'thread') {
                generatedIds.add(commentOrThread.id);
                for (const comment of commentOrThread.comments){
                    generatedIds.add(comment.id);
                }
            } else {
                generatedIds.add(commentOrThread.id);
            }
            // Get the document ID from the URL if not provided
            const docId = documentId || getDocumentIdFromUrl();
            // Save to Payload API
            if (commentOrThread.type === 'thread') {
                const threadObj = commentOrThread;
                // Save each comment in the thread
                for (const comment of threadObj.comments){
                    const success = await this.saveThreadComment(comment, threadObj, docId);
                    if (!success) {
                        return false;
                    }
                }
                return true;
            } else if (commentOrThread.type === 'comment' && thread) {
                // Save a comment that's part of a thread
                return await this.saveThreadComment(commentOrThread, thread, docId);
            }
            return false;
        }, 'Error saving comment', false);
    }
    /**
   * Unresolves a thread by setting resolved: false on all its comments
   */ async unresolveThread(threadId) {
        return withErrorHandling(async ()=>{
            const params = {
                'where[threadId][equals]': threadId
            };
            const data = await APIUtils.getPaginated(API_ENDPOINTS.COMMENTS, params);
            const updatePromises = data.docs.map(async (comment)=>{
                return APIUtils.patch(`${API_ENDPOINTS.COMMENTS}/${comment.id}`, {
                    resolved: false
                });
            });
            await Promise.all(updatePromises);
            return true;
        }, `Error unresolving thread ${threadId}`, false);
    }
}
// Export a singleton instance
export const commentService = new CommentService();

//# sourceMappingURL=commentService.js.map