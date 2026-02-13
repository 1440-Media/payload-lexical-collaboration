import type { LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical';
import React from 'react';
type AddCommentBoxProps = {
    anchorKey: NodeKey;
    editor: LexicalEditor;
    onAddComment: () => void;
};
export declare const AddCommentBox: React.FC<AddCommentBoxProps>;
export {};
