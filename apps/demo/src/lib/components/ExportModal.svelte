<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let exportedHtml = '';

  const dispatch = createEventDispatcher<{
    close: void;
    preview: void;
  }>();

  function handleClose() {
    dispatch('close');
  }

  function handlePreview() {
    dispatch('preview');
  }

  function handleCopyHtml() {
    navigator.clipboard.writeText(exportedHtml);
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        role="button" 
        tabindex="0" 
        on:click={handleClose} 
        on:keydown={(e) => e.key === 'Escape' && handleClose()}
      ></div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Exported HTML</h3>
            <button 
              class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={handleClose}
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="flex gap-2 mb-4">
            <button 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={handlePreview}
            >
              Preview
            </button>
            <button 
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              on:click={handleCopyHtml}
            >
              Copy HTML
            </button>
          </div>
          
          <textarea 
            class="w-full h-96 font-mono text-sm border border-gray-300 rounded-md p-3 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            readonly
            value={exportedHtml}
          ></textarea>
        </div>
      </div>
    </div>
  </div>
{/if}
