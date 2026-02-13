export type CommentFeatureProps = {
    /**
     * Whether to enable the commenting feature
     * @default true
     */
    enabled?: boolean;
    /**
     * Slug of the user collection (e.g. 'editors'). Defaults to 'users'.
     */
    userCollectionSlug?: string;
};
export declare const CommentFeature: import("@payloadcms/richtext-lexical").FeatureProviderProviderServer<CommentFeatureProps, CommentFeatureProps, CommentFeatureProps>;
