declare module '@svelte-email-editor/unlayer-svelte' {
  import type { SvelteComponent } from 'svelte';
  
  export class UnlayerEditor extends SvelteComponent {
    $$prop_def: {
      design?: Record<string, any>;
      tools?: { whitelist?: string[]; blacklist?: string[] };
      options?: Record<string, any>;
      className?: string;
      style?: string;
    };
    $$events_def: {
      loaded: CustomEvent<{ editor: any }>;
      'design-updated': CustomEvent<{ design: Record<string, any> }>;
      'export-html': CustomEvent<{ html: string; design: Record<string, any> }>;
    };
    $$slot_def: {};
    
    loadDesign(design: Record<string, any>): void;
    exportHtml(): Promise<{ html: string; design: Record<string, any> }>;
  }
  
  export interface UnlayerEditorMethods {
    loadDesign(design: Record<string, any>): void;
    exportHtml(): Promise<{ html: string; design: Record<string, any> }>;
  }
  
  export function loadUnlayerScript(src?: string): Promise<void>;
}
