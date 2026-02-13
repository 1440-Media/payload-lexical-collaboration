/**
 * Extracts the document ID from the current URL path
 * @returns The document ID or 'default' if not found
 */
export declare function getDocumentIdFromUrl(): string;
/**
 * Extracts the collection name from the current URL path
 * @returns The collection name or null if not found
 */
export declare function getCollectionFromUrl(): null | string;
/**
 * Gets the API endpoint for a document
 * @param collection The collection name
 * @param documentId The document ID
 * @returns The API endpoint for the document
 */
export declare function getDocumentApiEndpoint(collection: string, documentId: string): string;
