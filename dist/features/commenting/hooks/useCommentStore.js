'use client';
import { useEffect, useState } from 'react';
/**
 * React hook to use the comment store
 * @param commentStore The comment store instance
 * @returns The current comments
 */ export function useCommentStore(commentStore) {
    const [comments, setComments] = useState(commentStore.getComments());
    useEffect(()=>{
        return commentStore.registerOnChange(()=>{
            setComments(commentStore.getComments());
        });
    }, [
        commentStore
    ]);
    return comments;
}

//# sourceMappingURL=useCommentStore.js.map