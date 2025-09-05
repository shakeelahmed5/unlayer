export interface EditorState {
  isReady: boolean;
  status: string;
  currentDesign: Record<string, any> | null;
  error: string | null;
}

export interface ToastState {
  message: string;
  show: boolean;
}

export interface ModalState {
  showExport: boolean;
  showPreview: boolean;
  exportedHtml: string;
}

export interface EditorActions {
  loadSampleDesign: () => Promise<void>;
  exportHtml: () => Promise<any>;
  resetEditor: () => void;
  clearError: () => void;
}
