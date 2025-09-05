<script lang="ts">
  import { showToast, toastMessage } from '../composables/useEditor.js';
</script>

{#if $showToast}
  <div class="fixed bottom-4 right-4 z-50">
    <div class="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
      {$toastMessage}
    </div>
  </div>
{/if}
