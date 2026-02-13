import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import type { CommentStore } from '../store.js';
import type { MarkNodeMapType } from '../types/core.js';
import type { CommentOperationsResult } from '../types/hooks.js';
/**
 * Hook for handling comment operations
 * @param commentStore The comment store instance
 * @param editor The Lexical editor instance
 * @param markNodeMap Map of mark node keys to IDs
 * @param saveDocument Function to save the document
 * @returns Object with functions to handle comment operations
 */
export declare function useCommentOperations(commentStore: CommentStore, editor: LexicalEditor, markNodeMap: MarkNodeMapType, saveDocument: () => Promise<boolean | void>): CommentOperationsResult;
