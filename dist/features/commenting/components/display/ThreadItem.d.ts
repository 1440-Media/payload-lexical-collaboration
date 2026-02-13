import React from 'react';
import type { Thread } from '../../types/core.js';
type ThreadItemProps = {
    isActive: boolean;
    isInteractive: boolean;
    onDeleteComment: (commentId: string, thread: Thread) => void;
    onDeleteThread: (thread: Thread) => void;
    onResolveThread: () => void;
    onSubmitReply: (content: string, thread: Thread) => void;
    thread: Thread;
};
/**
 * Component for rendering a thread with its comments and reply composer
 */
export declare const ThreadItem: React.FC<ThreadItemProps>;
export {};
