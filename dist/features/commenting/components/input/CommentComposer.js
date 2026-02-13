'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
/**
 * Component for composing and submitting new comments
 */ export const CommentComposer = ({ placeholder = 'Type a comment...', submitAddComment })=>{
    const [content, setContent] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);
    const handleInputChange = (e)=>{
        const newContent = e.target.value;
        setContent(newContent);
        setCanSubmit(newContent.trim().length > 0);
    };
    const handleSubmit = ()=>{
        if (canSubmit) {
            submitAddComment(content);
            setContent('');
            setCanSubmit(false);
        }
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && canSubmit) {
            e.preventDefault();
            handleSubmit();
        }
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "CommentPlugin_CommentsPanel_Composer",
        children: [
            /*#__PURE__*/ _jsx("textarea", {
                className: "CommentPlugin_CommentsPanel_Editor",
                onChange: handleInputChange,
                onKeyDown: handleKeyDown,
                placeholder: placeholder,
                value: content
            }),
            /*#__PURE__*/ _jsx("button", {
                "aria-label": "Send comment",
                className: "CommentPlugin_CommentsPanel_SendButton",
                disabled: !canSubmit,
                onClick: handleSubmit,
                children: /*#__PURE__*/ _jsx("i", {
                    className: "send"
                })
            })
        ]
    });
};

//# sourceMappingURL=CommentComposer.js.map