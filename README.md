# Payload Lexical Collaboration Plugin

A Payload CMS plugin that adds collaborative commenting functionality to the Lexical rich text editor, enabling content teams to discuss and collaborate on content directly within the editor. Based on the example on https://playground.lexical.dev/ and the Payload plugin template.

## Features

- **Inline Comments**: Add comments to specific text selections within the editor
- **Comment Threads**: Create and manage threaded discussions on content
- **Comment Resolution**: Mark comments as resolved to track progress
- **User Attribution**: Comments are linked to Payload users for accountability
- **Real-time Updates**: Comments update in real-time when using Payload's REST API
- **Visual Highlighting**: Commented text is visually highlighted in the editor
- **Comment Panel**: Dedicated panel for viewing and managing all comments
- **Seamless Integration**: Works with Payload's existing user system and permissions

## Installation

```bash
npm install payload-lexical-collaboration
# or
yarn add payload-lexical-collaboration
# or
pnpm add payload-lexical-collaboration
```

## Usage

### Add to your Payload config

```typescript
import { buildConfig } from 'payload/config';
import { payloadLexicalCollaboration } from 'payload-lexical-collaboration';

export default buildConfig({
  // ... other config
  plugins: [
    payloadLexicalCollaboration({
      // Optional configuration options
      // disabled: false,
      // collections: { users: true } // Specify collections to add custom fields to
    }),
  ],
});
```

### Add the CommentFeature to Lexical

You can add the CommentFeature in two ways:

#### Option 1: Globally for all richText fields

```typescript
import { buildConfig } from 'payload/config';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { CommentFeature } from 'payload-lexical-collaboration';

export default buildConfig({
  // ... other config
  editor: lexicalEditor({
    features: [
      // ... other global features
      CommentFeature({
        // Optional configuration options
        // enabled: true,
      }),
    ],
  }),
  // ... rest of config
});
```

#### Option 2: Per field configuration

```typescript
import { CommentFeature } from 'payload-lexical-collaboration';

const Page = {
  slug: 'posts',
  fields: [
    {
      name: 'content',
      type: 'richText',
      features: [
        // ... other features
        CommentFeature({
          // Optional configuration options
          // enabled: true,
        }),
      ],
    },
  ],
};
```

## How It Works

The plugin consists of several key components:

1. **Payload Plugin**: Creates a new collection called `lexical-collaboration-plugin-comments` to store comments and their associated metadata.

2. **Lexical Feature**: Adds UI components and functionality to the Lexical editor for creating, viewing, and managing comments.

3. **Comment Store**: Manages the state of comments and provides methods for adding, deleting, and updating comments.

4. **Mark Nodes**: Uses Lexical's mark nodes to highlight commented text in the editor.

5. **API Integration**: Communicates with Payload's REST API to persist comments and sync them across users.

### Comment Structure

Comments are stored with the following structure:

- **documentId**: The ID of the document being commented on
- **threadId**: The ID of the thread the comment belongs to
- **content**: The text content of the comment
- **author**: Relationship to the Payload user who created the comment
- **quote**: The text that was selected when creating the comment
- **range**: JSON data representing the selection range
- **resolved**: Boolean indicating if the comment has been resolved
- **parentComment**: Optional relationship to a parent comment (for threaded replies)

## Configuration Options

### Plugin Options

The `payloadLexicalCollaboration` function accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable the plugin entirely while preserving database schema |
| `collections` | `Partial<Record<CollectionSlug, true>>` | `{}` | Specify collections to add custom fields to |

### Disabling the Plugin

When you need to disable the plugin, there are two recommended approaches:

#### Option 1: Use the `disabled` property (Recommended)

```typescript
payloadLexicalCollaboration({
  collections: {
    posts: true,
  },
  disabled: true, // This preserves comment marks in documents
})
```

This approach is recommended because it:
- Preserves the database schema for migrations
- Keeps the `MarkNode` registered to prevent "parseEditorState: type 'mark' not found" errors
- Hides all comment highlights in the editor (they become transparent)
- Disables all plugin functionality

#### Option 2: Use the CommentFeature with `enabled: false`

```typescript
CommentFeature({ enabled: false })
```

This approach:
- Registers the `MarkNode` to prevent errors
- Hides all comment highlights in the editor (they become transparent)
- Disables all commenting UI and functionality
- Is useful when you want to disable commenting for specific fields

> **Important**: Avoid completely commenting out the plugin in your config if you have documents with comment marks. This will cause "parseEditorState: type 'mark' not found" errors when loading those documents.

### Feature Options

The `CommentFeature` function accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable or disable the commenting feature for a specific field |

## Uninstallation

Before completely removing the plugin from your project, it's important to follow these steps to ensure your content remains accessible:

### Important Warning

**Leaving comment highlights in your documents will create node types that cannot be read without the plugin installed.** This can cause errors when loading documents after the plugin is removed.

### Safe Uninstallation Process

1. **Delete all comments**: Before uninstalling, ensure all comments and their highlights are removed from your documents.
   - Open each document with comments and use the "Delete All" function available within each post's comment tray
   - Make sure to save each document after deleting the comments

2. **Temporarily disable the plugin**: Use one of the disabling options mentioned above before completely removing it:
   ```typescript
   payloadLexicalCollaboration({
     disabled: true
   })
   ```

3. **Verify content integrity**: Open your documents to ensure they load correctly with the plugin disabled

4. **Remove the plugin**: Once you've confirmed all documents load correctly, you can safely:
   - Remove the plugin from your Payload configuration
   - Uninstall the package with your package manager:
     ```bash
     npm uninstall payload-lexical-collaboration
     # or
     yarn remove payload-lexical-collaboration
     # or
     pnpm remove payload-lexical-collaboration
     ```

> **Note**: If you've already uninstalled the plugin and are experiencing "parseEditorState: type 'mark' not found" errors, you'll need to reinstall the plugin, delete all comments, and then follow the safe uninstallation process.

## Requirements

- Payload CMS v3.17.1 or higher
- @payloadcms/richtext-lexical v3.17.1 or higher
- Node.js ^18.20.2 || >=20.9.0

## Development

### Project Structure

```
src/
├── index.ts                  # Main plugin entry point
├── exports/                  # Export files for client and RSC
└── features/
    └── commenting/           # Commenting feature implementation
        ├── api/              # API services
        ├── components/       # React components
        ├── hooks/            # React hooks
        ├── services/         # Service classes
        ├── types/            # TypeScript types
        ├── utils/            # Utility functions
        ├── command.ts        # Lexical commands
        ├── feature.client.tsx # Client-side feature implementation
        ├── feature.server.ts # Server-side feature implementation
        └── store.ts          # Comment state management
```

### Building

```bash
# Install dependencies
pnpm install

# Build the plugin
pnpm build
```

### Testing with the Dev Environment

This plugin includes a development environment with a pre-configured Payload CMS instance for testing:

1. Create a `.env` file in the `dev` directory (you can copy from `.env.example`):
   ```
   DATABASE_URL=file:./payload.db
   PAYLOAD_SECRET=YOUR_SECRET_HERE
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. The server will start at http://localhost:3000/admin with the following credentials:
   - Email: dev@payloadcms.com
   - Password: test

4. The dev environment includes:
   - A pre-configured `posts` collection with the commenting feature enabled
   - SQLite database for persistence
   - Next.js for the admin panel

This development environment is ideal for testing changes to the plugin or exploring its functionality before integrating it into your own project.

## License

MIT
