'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { MarkNode } from '@payloadcms/richtext-lexical/lexical/mark'
import { useAuth } from '@payloadcms/ui'

import type { CommentClientFeatureProps } from './types/props.js'

import { CommentPlugin } from './components/core/CommentPlugin.js'
import { CommentMarkStyles } from './components/ui/index.js'
import { getDocumentIdFromUrl } from './utils/url.js'

export const CommentClientFeature = createClientFeature<CommentClientFeatureProps>(
  ({ props }) => {
    const enabled = props?.enabled ?? true

    if (!enabled) {
      return {
        // Always register MarkNode even when disabled to prevent errors with existing marks
        nodes: [MarkNode],
        plugins: [
          {
            Component: () => <CommentMarkStyles enabled={false} />,
            position: 'normal',
          },
        ],
        toolbarFixed: {
          groups: [],
        },
        toolbarInline: {
          groups: [],
        },
      }
    }

    return {
      nodes: [MarkNode],
      plugins: [
        {
          Component: () => {
            const { user } = useAuth()
            
            // Get the document ID from the URL
            const documentId = typeof window !== 'undefined' 
              ? getDocumentIdFromUrl()
              : undefined
            
            // Get the current user's name or email
            const currentUser = user?.email || 'Anonymous'

            return (
              <>
                <CommentMarkStyles enabled={true} />
                <CommentPlugin 
                  currentUser={currentUser} 
                  documentId={documentId} 
                />
              </>
            )
          },
          position: 'normal',
        },
      ],
      toolbarFixed: {
        groups: [], // Commented out temporarily until toolbar buttons are fixed
        /* groups: [
          {
            type: 'dropdown',
            ChildComponent: CommentIcon,
            key: 'commenting',
            items: [
              {
                type: 'button',
                label: 'Add Comment',
                onClick: ({ editor }: { editor: any }) => {
                  editor.dispatchCommand(INSERT_COMMENT_COMMAND, undefined)
                },
                key: 'addComment',
              },
              {
                type: 'button',
                label: 'Toggle Comments',
                onClick: ({ editor }: { editor: any }) => {
                  editor.dispatchCommand(TOGGLE_COMMENTS_COMMAND, undefined)
                },
                key: 'toggleComments',
              },
            ],
          },
        ], */
      },
      toolbarInline: {
        groups: [], // Commented out temporarily until toolbar buttons are fixed
        /* groups: [
          {
            type: 'dropdown',
            ChildComponent: CommentIcon,
            key: 'commenting-inline',
            items: [
              {
                type: 'button',
                label: 'Add Comment',
                onClick: ({ editor }: { editor: any }) => {
                  editor.dispatchCommand(INSERT_COMMENT_COMMAND, undefined)
                },
                key: 'addComment-inline',
              },
            ],
          },
        ], */
      },
    }
  },
)
