import type { LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical';
import type { MarkNodeMapType } from '../../types/core.js';
/**
 * Hook for handling comment marks in the editor
 * @param editor The Lexical editor instance
 * @param setActiveIDs Function to set active comment IDs
 * @param setActiveAnchorKey Function to set active anchor key
 * @returns Map of mark node keys to IDs
 */
export declare function useCommentMarks(editor: LexicalEditor, setActiveIDs: (ids: string[]) => void, setActiveAnchorKey: (key: NodeKey | null) => void): MarkNodeMapType;
