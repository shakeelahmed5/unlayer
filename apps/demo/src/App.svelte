<script lang="ts">
  import Header from './lib/components/Header.svelte';
  import Toolbar from './lib/components/Toolbar.svelte';
  import ErrorBanner from './lib/components/ErrorBanner.svelte';
  import EditorContainer from './lib/components/EditorContainer.svelte';
  import ExportModal from './lib/components/ExportModal.svelte';
  import PreviewModal from './lib/components/PreviewModal.svelte';
  import Toast from './lib/components/Toast.svelte';
  import { 
    showExportModal, 
    showPreviewModal, 
    exportedHtml, 
    openExportModal, 
    closeExportModal,  
    closePreviewModal, 
    openPreviewFromExport 
  } from './lib/composables/useModals.js';

  function handleExportHtml(event: CustomEvent<{ result: any }>) {
    openExportModal(event.detail.result.html);
  }

  function handlePreviewFromExport() {
    openPreviewFromExport();
  }

</script>

<main class="min-h-screen bg-gray-50">
  <Header />
  <Toolbar on:export-html={handleExportHtml} />
  <ErrorBanner />
  <EditorContainer />
  
  <ExportModal 
    bind:isOpen={$showExportModal}
    bind:exportedHtml={$exportedHtml}
    on:close={closeExportModal}
    on:preview={handlePreviewFromExport}
  />
  
  <PreviewModal 
    bind:isOpen={$showPreviewModal}
    bind:exportedHtml={$exportedHtml}
    on:close={closePreviewModal}
  />
  
  <Toast />
</main>