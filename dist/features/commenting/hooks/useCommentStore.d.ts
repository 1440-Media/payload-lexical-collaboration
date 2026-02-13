import type { CommentStore } from '../store.js';
import type { Comments } from '../types/core.js';
/**
 * React hook to use the comment store
 * @param commentStore The comment store instance
 * @returns The current comments
 */
export declare function useCommentStore(commentStore: CommentStore): Comments;
