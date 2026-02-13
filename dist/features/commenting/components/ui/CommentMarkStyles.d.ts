import React from 'react';
import './CommentMarks.css';
import './DisabledCommentMarks.css';
/**
 * CommentMarkStyles component
 *
 * This component conditionally applies the appropriate CSS class for comment marks
 * based on whether the plugin is enabled or disabled.
 *
 * When enabled, it adds the 'comments-enabled' class to the document body.
 * When disabled, it adds the 'comments-disabled' class to the document body.
 */
export declare const CommentMarkStyles: React.FC<{
    enabled: boolean;
}>;
