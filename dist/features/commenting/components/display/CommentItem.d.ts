import React from 'react';
import type { Comment } from '../../types/core.js';
type CommentItemProps = {
    comment: Comment;
    onDelete?: () => void;
};
/**
 * Component for rendering a single comment
 */
export declare const CommentItem: React.FC<CommentItemProps>;
export {};
