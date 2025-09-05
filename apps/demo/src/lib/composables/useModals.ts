import { writable } from 'svelte/store';

// Modal state stores
export const showExportModal = writable(false);
export const showPreviewModal = writable(false);
export const exportedHtml = writable('');

// Modal actions
export function openExportModal(html: string) {
  exportedHtml.set(html);
  showExportModal.set(true);
}

export function closeExportModal() {
  showExportModal.set(false);
  exportedHtml.set('');
}

export function openPreviewModal(html: string) {
  exportedHtml.set(html);
  showPreviewModal.set(true);
}

export function closePreviewModal() {
  showPreviewModal.set(false);
  exportedHtml.set('');
}

export function openPreviewFromExport() {
  showExportModal.set(false);
  showPreviewModal.set(true);
}
