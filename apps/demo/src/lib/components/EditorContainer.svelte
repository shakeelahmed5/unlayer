<script lang="ts">
  import { UnlayerEditor } from '@svelte-email-editor/unlayer-svelte';
  import type { UnlayerEditorMethods } from '@svelte-email-editor/unlayer-svelte';
  import { 
    isEditorReady, 
    editorRef, 
    handleEditorLoaded, 
    handleDesignUpdated 
  } from '../composables/useEditor.js';

  // Local editor reference for binding
  let localEditorRef: UnlayerEditorMethods | null = null;

  // Update global reference when local reference changes
  $: if (localEditorRef) {
    editorRef.set(localEditorRef);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="editor-wrapper" style="height: 700px; position: relative;">
      {#if !$isEditorReady}
        <div class="flex items-center justify-center h-full bg-gray-50">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading Unlayer Editor...</p>
          </div>
        </div>
      {/if}
      <UnlayerEditor
        bind:this={localEditorRef}
        options={{
          projectId: undefined,
          displayMode: 'email',
          locale: 'en-US'
        }}
        on:loaded={handleEditorLoaded}
        on:design-updated={handleDesignUpdated}
        className="w-full h-full"
        style="height: 100%; width: 100%;"
      />
    </div>
  </div>
</div>

<style>
  :global(.editor-wrapper) {
    position: relative;
    overflow: hidden;
  }
  
  :global(.editor-wrapper iframe) {
    border: none;
    width: 100%;
    height: 100%;
  }
  
  /* Ensure Unlayer editor doesn't interfere with page layout */
  :global([id^="unlayer-"]) {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
  }
  
  /* Fix any potential z-index issues */
  :global(.unlayer-editor) {
    z-index: 1;
  }
</style>
