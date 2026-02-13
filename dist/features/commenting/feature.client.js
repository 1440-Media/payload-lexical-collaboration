'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import { MarkNode } from '@payloadcms/richtext-lexical/lexical/mark';
import { useAuth } from '@payloadcms/ui';
import { CommentPlugin } from './components/core/CommentPlugin.js';
import { CommentMarkStyles } from './components/ui/index.js';
import { getDocumentIdFromUrl } from './utils/url.js';
export const CommentClientFeature = createClientFeature(({ props })=>{
    const enabled = props?.enabled ?? true;
    if (!enabled) {
        return {
            // Always register MarkNode even when disabled to prevent errors with existing marks
            nodes: [
                MarkNode
            ],
            plugins: [
                {
                    Component: ()=>/*#__PURE__*/ _jsx(CommentMarkStyles, {
                            enabled: false
                        }),
                    position: 'normal'
                }
            ],
            toolbarFixed: {
                groups: []
            },
            toolbarInline: {
                groups: []
            }
        };
    }
    return {
        nodes: [
            MarkNode
        ],
        plugins: [
            {
                Component: ()=>{
                    const { user } = useAuth();
                    // Get the document ID from the URL
                    const documentId = typeof window !== 'undefined' ? getDocumentIdFromUrl() : undefined;
                    // Get the current user's name or email
                    const currentUser = user?.email || 'Anonymous';
                    return /*#__PURE__*/ _jsxs(_Fragment, {
                        children: [
                            /*#__PURE__*/ _jsx(CommentMarkStyles, {
                                enabled: true
                            }),
                            /*#__PURE__*/ _jsx(CommentPlugin, {
                                currentUser: currentUser,
                                documentId: documentId,
                                userCollectionSlug: props?.userCollectionSlug
                            })
                        ]
                    });
                },
                position: 'normal'
            }
        ],
        toolbarFixed: {
            groups: []
        },
        toolbarInline: {
            groups: []
        }
    };
});

//# sourceMappingURL=feature.client.js.map