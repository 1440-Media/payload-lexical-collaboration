import type { LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical';
import type { CommentCommandsResult } from '../../types/hooks.js';
/**
 * Hook for handling comment-related commands
 * @param editor The Lexical editor instance
 * @param setShowCommentInput Function to set whether to show the comment input
 * @param setShowComments Function to set whether to show comments
 * @param showComments Current state of showing comments
 * @param showCommentInput Current state of showing comment input
 * @param setActiveAnchorKey Function to set the active anchor key
 * @returns Object with functions to handle comment commands
 */
export declare function useCommentCommands(editor: LexicalEditor, setShowCommentInput: (show: boolean) => void, setShowComments: (show: boolean) => void, showComments: boolean, showCommentInput: boolean, setActiveAnchorKey: (key: NodeKey | null) => void): CommentCommandsResult;
