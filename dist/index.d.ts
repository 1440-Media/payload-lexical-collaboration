import type { CollectionSlug, Config } from 'payload';
export { CommentFeature } from './features/commenting/feature.server.js';
export type { CommentFeatureProps } from './features/commenting/feature.server.js';
export type PayloadLexicalCollaborationConfig = {
    /**
     * List of collections to add a custom field
     */
    collections?: Partial<Record<CollectionSlug, true>>;
    disabled?: boolean;
    /**
     * Slug of the user collection (e.g. 'editors'). Defaults to 'users'.
     */
    userCollectionSlug?: string;
};
export declare const payloadLexicalCollaboration: (pluginOptions: PayloadLexicalCollaborationConfig) => (config: Config) => Config;
