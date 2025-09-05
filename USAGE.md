# Usage Examples

## Basic Usage

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

## With Initial Design

```svelte
<script>
  import { UnlayerEditor } from '@svelte-email-editor/unlayer-svelte';
  import sampleDesign from './sample-design.json';
  
  let editorRef;
  let currentDesign = sampleDesign;
</script>

<UnlayerEditor
  bind:this={editorRef}
  design={currentDesign}
  options={{
    displayMode: 'email',
    locale: 'en-US'
  }}
/>
```

## With Custom Styling

```svelte
<script>
  import { UnlayerEditor } from '@svelte-email-editor/unlayer-svelte';
</script>

<UnlayerEditor
  className="my-custom-editor border border-gray-300 rounded-lg"
  style="min-height: 600px;"
  options={{
    displayMode: 'email'
  }}
/>
```

## Programmatic Control

```svelte
<script>
  import { UnlayerEditor } from '@svelte-email-editor/unlayer-svelte';
  import newDesign from './new-design.json';
  
  let editorRef;
  
  function loadNewDesign() {
    editorRef.loadDesign(newDesign);
  }
  
  async function exportAndDownload() {
    const result = await editorRef.exportHtml();
    
    // Create download link
    const blob = new Blob([result.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.html';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<UnlayerEditor bind:this={editorRef} />
<button on:click={loadNewDesign}>Load New Design</button>
<button on:click={exportAndDownload}>Export & Download</button>
```
