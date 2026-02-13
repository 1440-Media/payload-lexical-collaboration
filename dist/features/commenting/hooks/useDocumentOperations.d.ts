import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import type { DocumentOperationsResult } from '../types/hooks.js';
/**
 * Hook for handling document operations
 * @param editor The Lexical editor instance
 * @param documentId The document ID
 * @returns Object with document state and operations
 */
export declare function useDocumentOperations(editor: LexicalEditor, documentId?: string): DocumentOperationsResult;
