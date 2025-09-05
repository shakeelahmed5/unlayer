# Unlayer Svelte SDK

A Svelte wrapper for the Unlayer Email Editor, providing a clean and type-safe interface for building email editors in Svelte applications.

## Features

- 🎨 **Full Unlayer Editor Integration** - Complete access to Unlayer's powerful email editor
- ⚡ **Svelte 5 Compatible** - Built with the latest Svelte features
- 📦 **TypeScript Support** - Full type safety and IntelliSense
- 🎯 **Simple API** - Easy-to-use props and events
- 🔧 **Customizable** - Flexible configuration options
- 📱 **Responsive** - Mobile-friendly design with Tailwind CSS
- 🎨 **Modern UI** - Beautiful, accessible interface with Tailwind styling

## Installation

```bash
npm install @svelte-email-editor/unlayer-svelte
```

**Note:** The Unlayer script is loaded dynamically from CDN, so no additional dependencies are required.

## Quick Start

```svelte
<script>
  import { UnlayerEditor } from '@svelte-email-editor/unlayer-svelte';
  
  let editorRef;
  
  function handleLoaded(event) {
    console.log('Editor loaded:', event.detail.editor);
  }
  
  function handleDesignUpdated(event) {
    console.log('Design updated:', event.detail.design);
  }
  
  async function exportHtml() {
    const result = await editorRef.exportHtml();
    console.log('Exported HTML:', result.html);
  }
</script>

<UnlayerEditor
  bind:this={editorRef}
  options={{
    projectId: 'your-project-id',
    displayMode: 'email'
  }}
  on:loaded={handleLoaded}
  on:design-updated={handleDesignUpdated}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `design` | `Record<string, any>` | `undefined` | Initial design JSON to load |
| `tools` | `{ whitelist?: string[], blacklist?: string[] }` | `undefined` | Tool configuration |
| `options` | `Record<string, any>` | `{}` | Unlayer editor options |
| `class` | `string` | `''` | CSS class for styling |
| `style` | `string` | `''` | Inline styles |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `loaded` | `{ editor }` | Fired when editor is ready |
| `design-updated` | `{ design }` | Fired when design changes |
| `export-html` | `{ html, design }` | Fired when HTML is exported |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `loadDesign` | `design: Record<string, any>` | `void` | Load a design into the editor |
| `exportHtml` | - | `Promise<{ html: string, design: object }>` | Export current design as HTML |

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Start demo app
npm run dev
```

### Project Structure

```
├── packages/
│   └── unlayer-svelte/          # Main library package
│       ├── src/
│       │   ├── UnlayerEditor.svelte
│       │   ├── types.ts
│       │   ├── utils/
│       │   └── index.ts
│       └── package.json
├── apps/
│   └── demo/                    # Demo application
│       ├── src/
│       │   ├── App.svelte
│       │   ├── main.ts
│       │   └── welcome.json
│       └── package.json
└── package.json                 # Root workspace config
```

## License

MIT
