'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
export const AddCommentBox = ({ anchorKey, editor, onAddComment })=>{
    const boxRef = useRef(null);
    const updatePosition = useCallback(()=>{
        const boxElem = boxRef.current;
        const rootElement = editor.getRootElement();
        const anchorElement = editor.getElementByKey(anchorKey);
        if (boxElem !== null && rootElement !== null && anchorElement !== null) {
            const { right } = rootElement.getBoundingClientRect();
            const { top } = anchorElement.getBoundingClientRect();
            boxElem.style.left = `${right - 20}px`;
            boxElem.style.top = `${top - 30}px`;
        }
    }, [
        anchorKey,
        editor
    ]);
    useEffect(()=>{
        window.addEventListener('resize', updatePosition);
        return ()=>{
            window.removeEventListener('resize', updatePosition);
        };
    }, [
        editor,
        updatePosition
    ]);
    useLayoutEffect(()=>{
        updatePosition();
    }, [
        anchorKey,
        editor,
        updatePosition
    ]);
    return /*#__PURE__*/ _jsx("div", {
        className: "CommentPlugin_AddCommentBox",
        ref: boxRef,
        children: /*#__PURE__*/ _jsx("button", {
            "aria-label": "Add comment",
            className: "CommentPlugin_AddCommentBox_button",
            onClick: onAddComment,
            children: /*#__PURE__*/ _jsx("i", {
                className: "icon add-comment"
            })
        })
    });
};

//# sourceMappingURL=AddCommentBox.js.map