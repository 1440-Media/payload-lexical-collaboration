'use client';
import { useCallback } from 'react';
import { commentOperations } from '../services/commentOperations.js';
/**
 * Hook for handling comment operations
 * @param commentStore The comment store instance
 * @param editor The Lexical editor instance
 * @param markNodeMap Map of mark node keys to IDs
 * @param saveDocument Function to save the document
 * @returns Object with functions to handle comment operations
 */ export function useCommentOperations(commentStore, editor, markNodeMap, saveDocument) {
    // Delete a comment or thread
    const deleteCommentOrThread = useCallback((comment, thread)=>{
        return commentOperations.deleteCommentOrThread(commentStore, editor, markNodeMap, comment, thread, saveDocument);
    }, [
        commentStore,
        editor,
        markNodeMap,
        saveDocument
    ]);
    // Submit a new comment
    const submitAddComment = useCallback((commentOrThread, isInlineComment, thread, selection)=>{
        return commentOperations.submitAddComment(commentStore, editor, commentOrThread, isInlineComment, thread, selection, saveDocument);
    }, [
        commentStore,
        editor,
        saveDocument
    ]);
    // Resolve or unresolve a thread
    const resolveThread = useCallback((thread, resolved)=>{
        return commentOperations.resolveThread(commentStore, editor, markNodeMap, thread, resolved);
    }, [
        commentStore,
        editor,
        markNodeMap
    ]);
    // Delete all comments
    const deleteAllComments = useCallback(()=>{
        return commentOperations.deleteAllComments(commentStore, editor, markNodeMap, saveDocument);
    }, [
        commentStore,
        editor,
        markNodeMap,
        saveDocument
    ]);
    return {
        deleteAllComments,
        deleteCommentOrThread,
        resolveThread,
        submitAddComment
    };
}

//# sourceMappingURL=useCommentOperations.js.map