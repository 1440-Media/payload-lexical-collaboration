export { CommentFeature } from './features/commenting/feature.server.js';
export const payloadLexicalCollaboration = (pluginOptions)=>(config)=>{
        if (!config.collections) {
            config.collections = [];
        }
        // Add the comments collection
        config.collections.push({
            slug: 'lexical-collaboration-plugin-comments',
            access: {
                read: ()=>true
            },
            admin: {
                defaultColumns: [
                    'content',
                    'author',
                    'createdAt'
                ],
                hidden: true,
                useAsTitle: 'content'
            },
            fields: [
                {
                    name: 'documentId',
                    type: 'text',
                    index: true,
                    required: true
                },
                {
                    name: 'threadId',
                    type: 'text',
                    required: true
                },
                {
                    name: 'content',
                    type: 'text',
                    required: true
                },
                {
                    name: 'author',
                    type: 'relationship',
                    relationTo: pluginOptions.userCollectionSlug || 'users',
                    required: true
                },
                {
                    name: 'quote',
                    type: 'text'
                },
                {
                    name: 'range',
                    type: 'json'
                },
                {
                    name: 'resolved',
                    type: 'checkbox',
                    defaultValue: false
                },
                {
                    name: 'parentComment',
                    type: 'relationship',
                    relationTo: 'lexical-collaboration-plugin-comments'
                }
            ]
        });
        /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * 
     * NOTE: To properly disable this plugin while preserving existing comment marks in documents,
     * it's recommended to use the `disabled: true` option here rather than commenting out the plugin entirely.
     * This ensures the MarkNode is still registered to prevent "parseEditorState: type 'mark' not found" errors.
     * 
     * Alternatively, you can keep the CommentFeature in your editor features with `enabled: false`:
     * 
     * editor: lexicalEditor({
     *   features: ({ defaultFeatures }) => [
     *     ...defaultFeatures,
     *     CommentFeature({ enabled: false }),
     *   ],
     * }),
     */ if (pluginOptions.disabled) {
            return config;
        }
        if (!config.endpoints) {
            config.endpoints = [];
        }
        // Using Payload's built-in REST API for endpoints
        if (!config.admin) {
            config.admin = {};
        }
        if (!config.admin.components) {
            config.admin.components = {};
        }
        if (!config.admin.components.beforeDashboard) {
            config.admin.components.beforeDashboard = [];
        }
        const incomingOnInit = config.onInit;
        config.onInit = async (payload)=>{
            // Ensure we are executing any existing onInit functions before running our own.
            if (incomingOnInit) {
                await incomingOnInit(payload);
            }
        // Plugin initialization complete
        };
        return config;
    };

//# sourceMappingURL=index.js.map