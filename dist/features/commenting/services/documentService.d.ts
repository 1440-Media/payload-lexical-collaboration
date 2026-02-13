import type { LexicalEditor } from '@payloadcms/richtext-lexical/lexical';
import type { IDocumentService } from '../types/services.js';
export declare class DocumentService implements IDocumentService {
    /**
     * Check if a document exists in the database
     * @param documentId The document ID to check
     * @returns True if the document exists, false otherwise
     */
    checkIfDocumentExists(documentId: string): Promise<boolean>;
    /**
     * Detect the rich text field name in a document
     * @param collection The collection name
     * @param docId The document ID
     * @returns The detected field name or 'content' as default
     */
    detectRichTextField(collection: string, docId: string): Promise<string>;
    /**
     * Save the document content
     * @param editor The Lexical editor instance
     * @param documentId The document ID to save
     * @returns True if the document was saved successfully, false otherwise
     */
    saveDocument(editor: LexicalEditor, documentId: string): Promise<boolean>;
}
export declare const documentService: DocumentService;
