import { createServerFeature } from '@payloadcms/richtext-lexical';
export const CommentFeature = createServerFeature({
    feature ({ props }) {
        return {
            ClientFeature: 'payload-lexical-collaboration/client#CommentClientFeature',
            clientFeatureProps: {
                enabled: props?.enabled ?? true,
                userCollectionSlug: props?.userCollectionSlug
            }
        };
    },
    key: 'commenting'
});

//# sourceMappingURL=feature.server.js.map