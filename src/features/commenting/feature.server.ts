import { createServerFeature } from '@payloadcms/richtext-lexical'

export type CommentFeatureProps = {
  /**
   * Whether to enable the commenting feature
   * @default true
   */
  enabled?: boolean
  /**
   * Slug of the user collection (e.g. 'editors'). Defaults to 'users'.
   */
  userCollectionSlug?: string
}

export const CommentFeature = createServerFeature<
  CommentFeatureProps,
  CommentFeatureProps,
  CommentFeatureProps
>({
  feature({ props }) {
    return {
      ClientFeature: 'payload-lexical-collaboration/client#CommentClientFeature',
      clientFeatureProps: {
        enabled: props?.enabled ?? true,
        userCollectionSlug: props?.userCollectionSlug,
      },
    }
  },
  key: 'commenting',
})
