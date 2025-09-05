/**
 * Unlayer editor options that can be passed to the editor
 */
export interface UnlayerOptions {
  /** Unlayer project ID */
  projectId?: string;
  /** Display mode: 'email' or 'web' */
  displayMode?: 'email' | 'web';
  /** Locale for the editor */
  locale?: string;
  /** Editor appearance settings */
  appearance?: Record<string, any>;
  /** User information */
  user?: Record<string, any>;
  /** Merge tags for dynamic content */
  mergeTags?: Array<Record<string, any>>;
  /** Additional custom options */
  [key: string]: any;
}

/**
 * Tool configuration for the editor
 */
export interface ToolConfig {
  /** List of tools to whitelist */
  whitelist?: string[];
  /** List of tools to blacklist */
  blacklist?: string[];
}

/**
 * Props for the UnlayerEditor component
 */
export interface UnlayerEditorProps {
  /** Initial design JSON to load */
  design?: Record<string, any>;
  /** Tool configuration */
  tools?: ToolConfig;
  /** Unlayer editor options */
  options?: UnlayerOptions;
  /** CSS class for styling */
  className?: string;
  /** Inline styles */
  style?: string;
}

/**
 * Event payload for the loaded event
 */
export interface LoadedEvent {
  editor: any;
}

/**
 * Event payload for the design-updated event
 */
export interface DesignUpdatedEvent {
  design: Record<string, any>;
}

/**
 * Event payload for the export-html event
 */
export interface ExportHtmlEvent {
  html: string;
  design: Record<string, any>;
}

/**
 * Export result from the editor
 */
export interface ExportResult {
  html: string;
  design: Record<string, any>;
}

/**
 * Public methods exposed by the UnlayerEditor component
 */
export interface UnlayerEditorMethods {
  /** Load a design into the editor */
  loadDesign(design: Record<string, any>): void;
  /** Export the current design as HTML */
  exportHtml(): Promise<ExportResult>;
}
