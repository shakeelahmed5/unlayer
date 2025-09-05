<script lang="ts">
  import { isEditorReady, editorStatus } from '../composables/useEditor.js';

  $: statusClass = $isEditorReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
</script>

<header class="bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <h1 class="text-2xl font-bold text-gray-900">Unlayer Svelte SDK Demo</h1>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">Editor:</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {statusClass}">
          {$editorStatus}
        </span>
      </div>
    </div>
  </div>
</header>
