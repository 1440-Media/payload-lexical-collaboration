import React from 'react';
type CommentComposerProps = {
    placeholder?: string;
    submitAddComment: (content: string) => void;
};
/**
 * Component for composing and submitting new comments
 */
export declare const CommentComposer: React.FC<CommentComposerProps>;
export {};
