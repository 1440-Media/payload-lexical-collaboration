'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from 'react';
import { confirmDeleteAllComments, confirmDeleteComment, confirmDeleteThread } from '../../utils/dialog.js';
import { createComment } from '../../utils/factory.js';
import { CommentItem } from '../display/CommentItem.js';
import { ThreadItem } from '../display/ThreadItem.js';
/**
 * Panel for displaying and managing comments and threads
 */ export const CommentsPanel = ({ activeIDs, comments, currentUser, deleteAllComments, deleteCommentOrThread, markNodeMap, resolveThread, submitAddComment })=>{
    const listRef = useRef(null);
    const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
    const isEmpty = comments.length === 0;
    const handleDeleteComment = (commentId, thread)=>{
        if (!confirmDeleteComment()) {
            return;
        }
        // Find the comment in the thread or standalone
        const comment = thread ? thread.comments.find((c)=>c.id === commentId) : comments.find((c)=>c.id === commentId && c.type === 'comment');
        if (comment) {
            deleteCommentOrThread(comment, thread);
        }
    };
    const handleResolveThread = (thread)=>{
        void resolveThread(thread, !thread.resolved);
    };
    const handleDeleteThread = (thread)=>{
        if (confirmDeleteThread()) {
            deleteCommentOrThread(thread);
        }
    };
    const handleSubmitReply = (content, thread)=>{
        if (content.trim()) {
            submitAddComment(createComment(content, currentUser), false, thread);
        }
    };
    const toggleDeleteDropdown = ()=>{
        setShowDeleteDropdown(!showDeleteDropdown);
    };
    const handleDeleteAllComments = ()=>{
        if (deleteAllComments && confirmDeleteAllComments()) {
            deleteAllComments();
            setShowDeleteDropdown(false);
        }
    };
    // Close dropdown when clicking outside
    useEffect(()=>{
        const handleClickOutside = (event)=>{
            const target = event.target;
            if (!target.closest('.CommentPlugin_CommentsPanel_DeleteContainer')) {
                setShowDeleteDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return ()=>{
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return /*#__PURE__*/ _jsxs("div", {
        className: "CommentPlugin_CommentsPanel",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "CommentPlugin_CommentsPanel_Header",
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        className: "CommentPlugin_CommentsPanel_Heading",
                        children: "Comments"
                    }),
                    !isEmpty && deleteAllComments && /*#__PURE__*/ _jsxs("div", {
                        className: "CommentPlugin_CommentsPanel_DeleteContainer",
                        children: [
                            /*#__PURE__*/ _jsx("button", {
                                "aria-label": "Delete options",
                                className: "CommentPlugin_CommentsPanel_DeleteIcon",
                                onClick: toggleDeleteDropdown,
                                children: /*#__PURE__*/ _jsx("i", {
                                    className: "delete"
                                })
                            }),
                            showDeleteDropdown && /*#__PURE__*/ _jsx("div", {
                                className: "CommentPlugin_CommentsPanel_DeleteDropdown",
                                children: /*#__PURE__*/ _jsx("button", {
                                    "aria-label": "Delete all comments",
                                    className: "CommentPlugin_CommentsPanel_DeleteAllButton",
                                    onClick: handleDeleteAllComments,
                                    children: "Delete All"
                                })
                            })
                        ]
                    })
                ]
            }),
            isEmpty ? /*#__PURE__*/ _jsx("div", {
                className: "CommentPlugin_CommentsPanel_Empty",
                children: "No Comments"
            }) : /*#__PURE__*/ _jsx("ul", {
                className: "CommentPlugin_CommentsPanel_List",
                ref: listRef,
                children: comments.map((commentOrThread)=>{
                    const id = commentOrThread.id;
                    if (commentOrThread.type === 'thread') {
                        const thread = commentOrThread;
                        return /*#__PURE__*/ _jsx(ThreadItem, {
                            isActive: activeIDs.includes(id),
                            isInteractive: markNodeMap.has(id),
                            onDeleteComment: (commentId)=>handleDeleteComment(commentId, thread),
                            onDeleteThread: handleDeleteThread,
                            onResolveThread: ()=>handleResolveThread(thread),
                            onSubmitReply: (content)=>handleSubmitReply(content, thread),
                            thread: thread
                        }, id);
                    }
                    // Handle standalone comments (not in a thread)
                    return /*#__PURE__*/ _jsx(CommentItem, {
                        comment: commentOrThread,
                        onDelete: !commentOrThread.deleted ? ()=>handleDeleteComment(commentOrThread.id) : undefined
                    }, id);
                })
            })
        ]
    });
};

//# sourceMappingURL=CommentPanel.js.map