'use client';
import { $getNodeByKey, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical';
import { $isMarkNode, $unwrapMarkNode, $wrapSelectionInMarkNode } from '@payloadcms/richtext-lexical/lexical/mark';
import { commentService } from '../api/commentService.js';
import { API_ENDPOINTS } from '../types/api.js';
import { APIUtils } from '../utils/api.js';
import { withErrorHandling } from '../utils/errorHandling.js';
import { getDocumentIdFromUrl } from '../utils/url.js';
/**
 * Service for handling comment operations
 */ export class CommentOperations {
    /**
   * Delete all comments for the current document
   * @param commentStore The comment store instance
   * @param editor The Lexical editor instance
   * @param markNodeMap Map of mark node keys to IDs
   * @param saveDocumentCallback Optional callback to save the document after deletion
   */ async deleteAllComments(commentStore, editor, markNodeMap, saveDocumentCallback) {
        return withErrorHandling(async ()=>{
            // Get the document ID from the URL
            const documentId = getDocumentIdFromUrl();
            // Delete all comments from the database
            const success = await commentService.deleteAllComments(documentId);
            if (success) {
                // Clear comments from the store
                commentStore.deleteAllComments();
                // Remove all comment marks from the editor
                editor.update(()=>{
                    // Collect all mark node keys
                    const allMarkNodeKeys = new Set();
                    markNodeMap.forEach((keys)=>{
                        keys.forEach((key)=>allMarkNodeKeys.add(key));
                    });
                    // Unwrap all mark nodes
                    allMarkNodeKeys.forEach((key)=>{
                        const node = $getNodeByKey(key);
                        if ($isMarkNode(node)) {
                            $unwrapMarkNode(node);
                        }
                    });
                });
                // Save the document after removing all comment marks
                if (saveDocumentCallback) {
                    await saveDocumentCallback();
                }
            }
            return success;
        }, 'Error deleting all comments', false);
    }
    /**
   * Delete a comment or thread
   * @param commentStore The comment store instance
   * @param editor The Lexical editor instance
   * @param markNodeMap Map of mark node keys to IDs
   * @param comment The comment or thread to delete
   * @param thread The parent thread (if deleting a comment within a thread)
   * @param saveDocumentCallback Optional callback to save the document after deletion
   * @returns The deletion info or null
   */ async deleteCommentOrThread(commentStore, editor, markNodeMap, comment, thread, saveDocumentCallback) {
        return withErrorHandling(async ()=>{
            if (comment.type === 'comment') {
                const deletionInfo = commentStore.deleteCommentOrThread(comment, thread);
                if (!deletionInfo) {
                    return null;
                }
                const { index, markedComment } = deletionInfo;
                // Delete from the database
                await APIUtils.delete(`${API_ENDPOINTS.COMMENTS}/${comment.id}`);
                commentStore.addComment(markedComment, thread, index);
                return deletionInfo;
            } else {
                commentStore.deleteCommentOrThread(comment);
                // Delete all comments in the thread from the database
                const threadId = comment.id;
                const params = {
                    'where[threadId][equals]': threadId
                };
                const data = await APIUtils.getPaginated(API_ENDPOINTS.COMMENTS, params);
                if (data.docs && Array.isArray(data.docs)) {
                    const deletePromises = data.docs.map(async (threadComment)=>{
                        return APIUtils.delete(`${API_ENDPOINTS.COMMENTS}/${threadComment.id}`);
                    });
                    await Promise.all(deletePromises);
                }
                // Remove ids from associated marks
                const id = thread !== undefined ? thread.id : comment.id;
                const markNodeKeys = markNodeMap.get(id);
                if (markNodeKeys !== undefined) {
                    // Do async to avoid causing a React infinite loop
                    setTimeout(async ()=>{
                        editor.update(()=>{
                            for (const key of markNodeKeys){
                                const node = $getNodeByKey(key);
                                if ($isMarkNode(node)) {
                                    node.deleteID(id);
                                    if (node.getIDs().length === 0) {
                                        $unwrapMarkNode(node);
                                    }
                                }
                            }
                        });
                        // Save the document after removing comment marks
                        if (saveDocumentCallback) {
                            await saveDocumentCallback();
                        }
                    });
                }
                return null;
            }
        }, 'Error deleting comment or thread', null);
    }
    /**
   * Resolve or unresolve a thread
   */ async resolveThread(commentStore, editor, markNodeMap, thread, resolved) {
        return withErrorHandling(async ()=>{
            const success = await commentStore.resolveThread(thread.id, resolved);
            if (!success) {
                return false;
            }
            // Update mark node DOM classes
            markNodeMap.get(thread.id)?.forEach((key)=>{
                editor.getElementByKey(key)?.classList.toggle('resolved', resolved);
            });
            return true;
        }, `Error ${resolved ? 'resolving' : 'unresolving'} thread ${thread.id}`, false);
    }
    /**
   * Submit a new comment or thread
   * @param commentStore The comment store instance
   * @param editor The Lexical editor instance
   * @param commentOrThread The comment or thread to add
   * @param isInlineComment Whether this is an inline comment
   * @param thread The parent thread (if adding a comment to a thread)
   * @param selection The current selection (for inline comments)
   * @param saveDocumentCallback Optional callback to save the document after adding the comment
   */ async submitAddComment(commentStore, editor, commentOrThread, isInlineComment, thread, selection, saveDocumentCallback) {
        return withErrorHandling(async ()=>{
            // Use saveComment instead of addComment to persist to database
            await commentStore.saveComment(commentOrThread, thread);
            if (isInlineComment && selection) {
                editor.update(()=>{
                    if ($isRangeSelection(selection)) {
                        const isBackward = selection.isBackward();
                        const id = commentOrThread.id;
                        // Wrap content in a MarkNode
                        $wrapSelectionInMarkNode(selection, isBackward, id);
                    }
                });
                // Save the document after adding a comment
                if (saveDocumentCallback) {
                    await saveDocumentCallback();
                }
            }
        }, 'Error submitting comment', undefined);
    }
}
// Export a singleton instance
export const commentOperations = new CommentOperations();

//# sourceMappingURL=commentOperations.js.map