<script lang="ts">
  import { isEditorReady, loadSampleDesign, exportHtml, resetEditor } from '../composables/useEditor.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    'export-html': { result: any };
  }>();

  async function handleExportHtml() {
    const result = await exportHtml();
    if (result) {
      dispatch('export-html', { result });
    }
  }
</script>

<div class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
      <div class="flex flex-wrap gap-2">
        <button 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          on:click={loadSampleDesign}
          disabled={!$isEditorReady}
        >
          Load Sample Design
        </button>
        <button 
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          on:click={handleExportHtml}
          disabled={!$isEditorReady}
        >
          Export HTML
        </button>
        <button 
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          on:click={resetEditor}
          disabled={!$isEditorReady}
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</div>
