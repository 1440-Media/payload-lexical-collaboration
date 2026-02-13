'use client';
import { $getNodeByKey, $getSelection, $isRangeSelection, $isTextNode } from '@payloadcms/richtext-lexical/lexical';
import { $createMarkNode, $getMarkIDs, $isMarkNode, MarkNode } from '@payloadcms/richtext-lexical/lexical/mark';
import { mergeRegister, registerNestedElementResolver } from '@payloadcms/richtext-lexical/lexical/utils';
import { useEffect, useMemo } from 'react';
/**
 * Hook for handling comment marks in the editor
 * @param editor The Lexical editor instance
 * @param setActiveIDs Function to set active comment IDs
 * @param setActiveAnchorKey Function to set active anchor key
 * @returns Map of mark node keys to IDs
 */ export function useCommentMarks(editor, setActiveIDs, setActiveAnchorKey) {
    // Create a map to track mark nodes
    const markNodeMap = useMemo(()=>{
        return new Map();
    }, []);
    useEffect(()=>{
        const markNodeKeysToIDs = new Map();
        return mergeRegister(// Register nested element resolver for mark nodes
        registerNestedElementResolver(editor, MarkNode, (from)=>{
            return $createMarkNode(from.getIDs());
        }, (from, to)=>{
            // Merge the IDs
            const ids = from.getIDs();
            ids.forEach((id)=>{
                to.addID(id);
            });
        }), // Register mutation listener for mark nodes
        editor.registerMutationListener(MarkNode, (mutations)=>{
            editor.getEditorState().read(()=>{
                for (const [key, mutation] of mutations){
                    const node = $getNodeByKey(key);
                    let ids = [];
                    if (mutation === 'destroyed') {
                        ids = markNodeKeysToIDs.get(key) || [];
                    } else if ($isMarkNode(node)) {
                        ids = node.getIDs();
                    }
                    for(let i = 0; i < ids.length; i++){
                        const id = ids[i];
                        let markNodeKeys = markNodeMap.get(id);
                        markNodeKeysToIDs.set(key, ids);
                        if (mutation === 'destroyed') {
                            if (markNodeKeys !== undefined) {
                                markNodeKeys.delete(key);
                                if (markNodeKeys.size === 0) {
                                    markNodeMap.delete(id);
                                }
                            }
                        } else {
                            if (markNodeKeys === undefined) {
                                markNodeKeys = new Set();
                                markNodeMap.set(id, markNodeKeys);
                            }
                            if (!markNodeKeys.has(key)) {
                                markNodeKeys.add(key);
                            }
                        }
                    }
                }
            });
        }, {
            skipInitialization: false
        }), // Register update listener to track active IDs and anchor key
        editor.registerUpdateListener(({ editorState })=>{
            editorState.read(()=>{
                const selection = $getSelection();
                let hasActiveIds = false;
                let hasAnchorKey = false;
                if ($isRangeSelection(selection)) {
                    const anchorNode = selection.anchor.getNode();
                    if ($isTextNode(anchorNode)) {
                        const commentIDs = $getMarkIDs(anchorNode, selection.anchor.offset);
                        if (commentIDs !== null) {
                            setActiveIDs(commentIDs);
                            hasActiveIds = true;
                        }
                        if (!selection.isCollapsed()) {
                            setActiveAnchorKey(anchorNode.getKey());
                            hasAnchorKey = true;
                        }
                    }
                }
                if (!hasActiveIds) {
                    setActiveIDs([]);
                }
                if (!hasAnchorKey) {
                    setActiveAnchorKey(null);
                }
            });
        }));
    }, [
        editor,
        markNodeMap,
        setActiveIDs,
        setActiveAnchorKey
    ]);
    return markNodeMap;
}

//# sourceMappingURL=useCommentMarks.js.map