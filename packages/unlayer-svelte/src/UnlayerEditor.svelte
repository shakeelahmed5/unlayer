<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { loadUnlayerScript } from './utils/loadUnlayerScript.js';
  import type { 
    LoadedEvent, 
    DesignUpdatedEvent, 
    ExportHtmlEvent, 
    ExportResult 
  } from './types.js';

  // Props
  export let design: Record<string, any> | undefined = undefined;
  export let tools: { whitelist?: string[]; blacklist?: string[] } | undefined = undefined;
  export let options: Record<string, any> = {};
  export let className: string | undefined = undefined;
  export let style: string | undefined = undefined;

  // Use tools in options if provided
  $: if (tools) {
    options = { ...options, tools };
  }

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    loaded: LoadedEvent;
    'design-updated': DesignUpdatedEvent;
    'export-html': ExportHtmlEvent;
  }>();

  // Component state
  let containerId = `unlayer-${Math.random().toString(36).slice(2)}`;
  let editor: any = null;
  let isLoaded = false;
  let isLoading = true;
  let error: string | null = null;
  let removeListener: (() => void) | null = null;

  /**
   * Load a design into the editor
   */
  function loadDesign(designData: Record<string, any>): void {
    if (editor && isLoaded) {
      try {
        // Validate design data before loading
        if (!designData || typeof designData !== 'object') {
          console.warn('Invalid design data provided, using empty design');
          designData = {
            counters: { u_column: 0, u_row: 0, u_content_text: 0 },
            body: { id: "body", rows: [], values: {} },
            schemaVersion: 16
          };
        }
        
        editor.loadDesign(designData);
      } catch (err) {
        console.error('Failed to load design:', err);
        error = 'Failed to load design';
      }
    }
  }

  /**
   * Export the current design as HTML
   */
  function exportHtml(): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      if (!editor || !isLoaded) {
        reject(new Error('Editor not loaded'));
        return;
      }

      editor.exportHtml((data: any) => {
        const result: ExportResult = {
          html: data.html,
          design: data.design
        };
        
        // Dispatch export event
        dispatch('export-html', result);
        resolve(result);
      });
    });
  }

  // Expose public methods
  export { loadDesign, exportHtml };

  onMount(async () => {
    try {
      isLoading = true;
      error = null;

      // Load Unlayer script
      await loadUnlayerScript();

      // Create editor
      editor = (window as any).unlayer?.createEditor({
        id: containerId,
        displayMode: options?.displayMode ?? 'email',
        ...options,
      });

      // Ensure the editor container is properly sized
      const container = document.getElementById(containerId);
      if (container) {
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px';
      }

      // Set up event listeners
      editor.addEventListener('editor:ready', () => {
        isLoaded = true;
        isLoading = false;
        
        // Dispatch loaded event
        const loadedEvent: LoadedEvent = { editor };
        dispatch('loaded', loadedEvent);
        
        // Load initial design if provided
        if (design) {
          loadDesign(design);
        }
      });

      const handler = () => {
        editor?.saveDesign((d: any) => {
          const eventData: DesignUpdatedEvent = {
            design: d
          };
          dispatch('design-updated', eventData);
        });
      };
      
      editor.addEventListener('design:updated', handler);
      removeListener = () => editor.removeEventListener('design:updated', handler);

    } catch (err) {
      console.error('Failed to initialize Unlayer editor:', err);
      error = err instanceof Error ? err.message : 'Failed to initialize editor';
      isLoading = false;
    }
  });

  onDestroy(() => {
    // Clean up event listeners
    removeListener?.();
    
    // Unlayer does not expose a hard destroy; removing the node is fine
    const node = document.getElementById(containerId);
    if (node?.parentNode) {
      node.parentNode.removeChild(node);
    }
    
    editor = null;
    isLoaded = false;
  });

  // Reactive statement to load design when prop changes
  $: if (design && editor && isLoaded) {
    loadDesign(design);
  }
</script>

<div class={className} {style}>
  <div id={containerId} style="width:100%;height:100%;min-height:400px;"></div>
</div>

