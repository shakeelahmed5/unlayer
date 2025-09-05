import { writable, get } from 'svelte/store';
import type { UnlayerEditorMethods } from '@svelte-email-editor/unlayer-svelte';
import welcomeDesign from '../../welcome.json';

// Local type definitions
export interface ExportResult {
  html: string;
  design: Record<string, any>;
}

export interface DesignUpdatedEvent {
  design: Record<string, any>;
}

// Editor state stores
export const isEditorReady = writable(false);
export const editorStatus = writable('Loading...');
export const currentDesign = writable<Record<string, any> | null>(null);
export const error = writable<string | null>(null);

// Editor reference - using a writable store for proper reactivity
export const editorRef = writable<UnlayerEditorMethods | null>(null);

// Toast state
export const toastMessage = writable('');
export const showToast = writable(false);

// Toast utility function
export function showToastMessage(message: string) {
  toastMessage.set(message);
  showToast.set(true);
  setTimeout(() => {
    showToast.set(false);
  }, 3000);
}

// Editor event handlers
export function handleEditorLoaded() {
  isEditorReady.set(true);
  editorStatus.set('Ready');
  showToastMessage('Editor loaded successfully!');
}

export function handleDesignUpdated(event: CustomEvent<DesignUpdatedEvent>) {
  currentDesign.set(event.detail.design);
  console.log('Design updated:', event.detail.design);
}

export function handleExportHtml(event: CustomEvent<ExportResult>) {
  console.log('HTML exported:', event.detail.html);
}

// Editor actions
export async function loadSampleDesign() {
  const editor = get(editorRef);
  if (!editor) {
    showToastMessage('Editor not ready yet');
    return;
  }

  try {
    editor.loadDesign(welcomeDesign);
    showToastMessage('Sample design loaded!');
  } catch (err) {
    error.set('Failed to load sample design');
    showToastMessage('Failed to load sample design');
  }
}

export async function exportHtml(): Promise<ExportResult | null> {
  const editor = get(editorRef);
  if (!editor) {
    showToastMessage('Editor not ready yet');
    return null;
  }

  try {
    const result = await editor.exportHtml();
    showToastMessage('HTML exported successfully!');
    return result;
  } catch (err) {
    error.set('Failed to export HTML');
    showToastMessage('Failed to export HTML');
    return null;
  }
}

export function resetEditor() {
  const editor = get(editorRef);
  if (!editor) {
    showToastMessage('Editor not ready yet');
    return;
  }

  try {
    // Load a minimal valid design structure
    const emptyDesign = {
      counters: {
        u_column: 0,
        u_row: 0,
        u_content_text: 0
      },
      body: {
        id: "body",
        rows: [],
        values: {
          popupPosition: "center",
          popupWidth: "600px",
          popupHeight: "auto",
          borderRadius: "3px",
          contentWidth: "600px",
          contentHeight: "auto",
          contentAlign: "center",
          fontFamily: {
            label: "Arial",
            value: "arial,helvetica,sans-serif"
          },
          textColor: "#000000",
          backgroundColor: "#ffffff",
          backgroundImage: {
            url: "",
            fullWidth: true,
            repeat: "no-repeat",
            size: "custom",
            position: "center"
          },
          preheaderText: "",
          linkStyle: {
            body: true,
            linkColor: "#0000ee",
            linkHoverColor: "#0000ee",
            linkUnderline: true,
            linkHoverUnderline: true
          },
          _meta: {
            htmlID: "u_body",
            htmlClassNames: "u_body"
          }
        }
      },
      schemaVersion: 16
    };
    
    editor.loadDesign(emptyDesign);
    currentDesign.set(emptyDesign);
    showToastMessage('Editor reset!');
  } catch (err) {
    error.set('Failed to reset editor');
    showToastMessage('Failed to reset editor');
  }
}

// Clear error function
export function clearError() {
  error.set(null);
}
