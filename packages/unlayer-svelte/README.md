# @svelte-email-editor/unlayer-svelte

A Svelte wrapper for the Unlayer Email Editor, providing a clean and type-safe interface for building email editors in Svelte applications.

## Features

- 🎨 **Full Unlayer Editor Integration** - Complete access to Unlayer's powerful email editor
- ⚡ **Svelte 5 Compatible** - Built with the latest Svelte features
- 📦 **TypeScript Support** - Full type safety and IntelliSense
- 🎯 **Simple API** - Easy-to-use props and events
- 🔧 **Customizable** - Flexible configuration options
- 📱 **Responsive** - Mobile-friendly design
- 🧪 **Well Tested** - 38 comprehensive unit tests

## Installation

```bash
npm install svelte-unlayer-editor
```

**Note:** The Unlayer script is loaded dynamically from CDN, so no additional dependencies are required.

## Quick Start

```svelte
<script lang="ts">
  import UnlayerEditor from 'svelte-unlayer-editor';
  import initialDesign from './welcome.json';
  
  function handleExport(event) {
    const { html, design } = event.detail;
    console.log(html, design);
  }
</script>

<UnlayerEditor
  design={initialDesign}
  on:export-html={handleExport}
/>
```

## Advanced Usage

```svelte
<script lang="ts">
  import UnlayerEditor from 'svelte-unlayer-editor';
  import type { UnlayerEditorMethods } from '@svelte-email-editor/unlayer-svelte';
  
  let editorRef: UnlayerEditorMethods;
  let currentDesign: Record<string, any> = {};
  
  function handleLoaded(event) {
    console.log('Editor loaded:', event.detail.editor);
  }
  
  function handleDesignUpdated(event) {
    currentDesign = event.detail.design;
    console.log('Design updated:', currentDesign);
  }
  
  function handleExport(event) {
    const { html, design } = event.detail;
    console.log('Exported HTML:', html);
    console.log('Design JSON:', design);
  }
  
  async function exportHtml() {
    const result = await editorRef.exportHtml();
    console.log('Exported HTML:', result.html);
  }
  
  function loadNewDesign() {
    const newDesign = {
      counters: { u_column: 0, u_row: 0, u_content_text: 0 },
      body: { id: "body", rows: [], values: {} },
      schemaVersion: 16
    };
    editorRef.loadDesign(newDesign);
  }
</script>

<UnlayerEditor
  bind:this={editorRef}
  design={currentDesign}
  options={{
    projectId: 'your-project-id',
    displayMode: 'email',
    locale: 'en'
  }}
  tools={{
    whitelist: ['text', 'image', 'button'],
    blacklist: ['video']
  }}
  className="my-editor"
  style="height: 600px; border: 1px solid #ccc;"
  on:loaded={handleLoaded}
  on:design-updated={handleDesignUpdated}
  on:export-html={handleExport}
/>

<button on:click={exportHtml}>Export HTML</button>
<button on:click={loadNewDesign}>Load New Design</button>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `design` | `Record<string, any>` | `undefined` | Initial design JSON to load |
| `tools` | `{ whitelist?: string[], blacklist?: string[] }` | `undefined` | Tool configuration |
| `options` | `Record<string, any>` | `{}` | Unlayer editor options |
| `className` | `string` | `undefined` | CSS class for styling |
| `style` | `string` | `undefined` | Inline styles |

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

# Run tests
npm run test:run
```

### Testing

The project includes comprehensive unit tests using Vitest:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ Component initialization and options
- ✅ Event emission (loaded, design-updated, export-html)
- ✅ Design loading and validation
- ✅ Error handling and edge cases
- ✅ Public method functionality
- ✅ TypeScript interface validation
- ✅ Utility function testing

**38 tests passing** with 100% success rate

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on [GitHub](https://github.com/shakeelahmed5/unlayer/issues).
