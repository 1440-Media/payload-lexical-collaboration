'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { TimeAgo } from './TimeAgo.js';
/**
 * Component for rendering a single comment
 */ export const CommentItem = ({ comment, onDelete })=>{
    return /*#__PURE__*/ _jsxs("li", {
        className: "CommentPlugin_CommentsPanel_List_Comment",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "CommentPlugin_CommentsPanel_List_Details",
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "CommentPlugin_CommentsPanel_List_Comment_Author",
                        children: comment.author
                    }),
                    /*#__PURE__*/ _jsxs("span", {
                        className: "CommentPlugin_CommentsPanel_List_Comment_Time",
                        children: [
                            "· ",
                            /*#__PURE__*/ _jsx(TimeAgo, {
                                timestamp: comment.timeStamp
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("p", {
                className: comment.deleted ? 'CommentPlugin_CommentsPanel_DeletedComment' : '',
                children: comment.content
            }),
            !comment.deleted && onDelete && /*#__PURE__*/ _jsx("button", {
                "aria-label": "Delete comment",
                className: "CommentPlugin_CommentsPanel_List_DeleteButton",
                onClick: onDelete,
                children: /*#__PURE__*/ _jsx("i", {
                    className: "delete"
                })
            })
        ]
    });
};

//# sourceMappingURL=CommentItem.js.map