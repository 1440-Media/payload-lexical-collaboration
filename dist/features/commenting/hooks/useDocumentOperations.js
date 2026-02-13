'use client';
import { useCallback, useEffect, useState } from 'react';
import { documentService } from '../services/documentService.js';
/**
 * Hook for handling document operations
 * @param editor The Lexical editor instance
 * @param documentId The document ID
 * @returns Object with document state and operations
 */ export function useDocumentOperations(editor, documentId = 'default') {
    const [isDocumentSaved, setIsDocumentSaved] = useState(false);
    // Check if the document exists in the database
    const checkIfDocumentExists = useCallback(async ()=>{
        return await documentService.checkIfDocumentExists(documentId);
    }, [
        documentId
    ]);
    // Function to save the document content
    const saveDocument = useCallback(async ()=>{
        const success = await documentService.saveDocument(editor, documentId);
        if (success) {
            setIsDocumentSaved(true);
        }
        return success;
    }, [
        documentId,
        editor
    ]);
    // Check if document exists when component mounts
    useEffect(()=>{
        checkIfDocumentExists().then((exists)=>{
            setIsDocumentSaved(exists);
        });
    }, [
        checkIfDocumentExists
    ]);
    return {
        checkIfDocumentExists,
        isDocumentSaved,
        saveDocument,
        setIsDocumentSaved
    };
}

//# sourceMappingURL=useDocumentOperations.js.map