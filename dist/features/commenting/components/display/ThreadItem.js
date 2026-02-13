'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CommentComposer } from '../input/CommentComposer.js';
import { CommentItem } from './CommentItem.js';
/**
 * Component for rendering a thread with its comments and reply composer
 */ export const ThreadItem = ({ isActive, isInteractive, onDeleteComment, onDeleteThread, onResolveThread, onSubmitReply, thread })=>{
    const isResolved = thread.resolved || false;
    return /*#__PURE__*/ _jsxs("li", {
        className: `CommentPlugin_CommentsPanel_List_Thread ${isInteractive ? 'interactive' : ''} ${isActive ? 'active' : ''} ${isResolved ? 'resolved' : ''}`,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "CommentPlugin_CommentsPanel_List_Thread_QuoteBox",
                children: [
                    /*#__PURE__*/ _jsxs("blockquote", {
                        className: "CommentPlugin_CommentsPanel_List_Thread_Quote",
                        children: [
                            '> ',
                            /*#__PURE__*/ _jsx("span", {
                                children: thread.quote
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        "aria-label": isResolved ? 'Unresolve thread' : 'Resolve thread',
                        className: "CommentPlugin_CommentsPanel_List_ResolveButton",
                        onClick: onResolveThread,
                        title: isResolved ? 'Unresolve thread' : 'Resolve thread',
                        type: "button",
                        children: /*#__PURE__*/ _jsx("i", {
                            className: isResolved ? 'unresolve' : 'resolve'
                        })
                    }),
                    !isResolved && /*#__PURE__*/ _jsx("button", {
                        "aria-label": "Delete thread",
                        className: "CommentPlugin_CommentsPanel_List_DeleteButton",
                        onClick: ()=>onDeleteThread(thread),
                        type: "button",
                        children: /*#__PURE__*/ _jsx("i", {
                            className: "delete"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("ul", {
                className: "CommentPlugin_CommentsPanel_List_Thread_Comments",
                children: thread.comments.map((comment)=>/*#__PURE__*/ _jsx(CommentItem, {
                        comment: comment,
                        onDelete: !comment.deleted && !isResolved ? ()=>onDeleteComment(comment.id, thread) : undefined
                    }, comment.id))
            }),
            !isResolved && /*#__PURE__*/ _jsx("div", {
                className: "CommentPlugin_CommentsPanel_List_Thread_Editor",
                children: /*#__PURE__*/ _jsx(CommentComposer, {
                    placeholder: "Reply to comment...",
                    submitAddComment: (content)=>onSubmitReply(content, thread)
                })
            })
        ]
    });
};

//# sourceMappingURL=ThreadItem.js.map