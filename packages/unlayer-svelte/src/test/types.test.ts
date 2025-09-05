import { describe, it, expect } from 'vitest';
import type {
  UnlayerOptions,
  ToolConfig,
  UnlayerEditorProps,
  LoadedEvent,
  DesignUpdatedEvent,
  ExportHtmlEvent,
  ExportResult,
  UnlayerEditorMethods,
} from '../types';

describe('Type Definitions', () => {
  describe('UnlayerOptions', () => {
    it('should accept valid options', () => {
      const options: UnlayerOptions = {
        projectId: 'test-project',
        displayMode: 'email',
        locale: 'en',
        appearance: { theme: 'modern' },
        user: { id: 'user123' },
        mergeTags: [{ name: 'Name', value: '{{name}}' }],
        customOption: 'value',
      };

      expect(options.projectId).toBe('test-project');
      expect(options.displayMode).toBe('email');
      expect(options.customOption).toBe('value');
    });

    it('should allow additional properties', () => {
      const options: UnlayerOptions = {
        customField: 'customValue',
        anotherField: 123,
      };

      expect(options.customField).toBe('customValue');
      expect(options.anotherField).toBe(123);
    });
  });

  describe('ToolConfig', () => {
    it('should accept whitelist and blacklist', () => {
      const tools: ToolConfig = {
        whitelist: ['text', 'image'],
        blacklist: ['video'],
      };

      expect(tools.whitelist).toEqual(['text', 'image']);
      expect(tools.blacklist).toEqual(['video']);
    });

    it('should allow partial configuration', () => {
      const toolsWhitelist: ToolConfig = {
        whitelist: ['text'],
      };

      const toolsBlacklist: ToolConfig = {
        blacklist: ['video'],
      };

      expect(toolsWhitelist.whitelist).toEqual(['text']);
      expect(toolsBlacklist.blacklist).toEqual(['video']);
    });
  });

  describe('UnlayerEditorProps', () => {
    it('should accept all props', () => {
      const props: UnlayerEditorProps = {
        design: { id: 'test', body: { rows: [] } },
        tools: { whitelist: ['text'] },
        options: { projectId: 'test' },
        className: 'custom-class',
        style: 'background: red;',
      };

      expect(props.design).toBeDefined();
      expect(props.tools).toBeDefined();
      expect(props.options).toBeDefined();
      expect(props.className).toBe('custom-class');
      expect(props.style).toBe('background: red;');
    });

    it('should allow partial props', () => {
      const minimalProps: UnlayerEditorProps = {};

      expect(minimalProps).toBeDefined();
    });
  });

  describe('Event Types', () => {
    it('should define LoadedEvent correctly', () => {
      const event: LoadedEvent = {
        editor: { createEditor: () => {} },
      };

      expect(event.editor).toBeDefined();
    });

    it('should define DesignUpdatedEvent correctly', () => {
      const event: DesignUpdatedEvent = {
        design: { id: 'test', body: { rows: [] } },
      };

      expect(event.design).toBeDefined();
    });

    it('should define ExportHtmlEvent correctly', () => {
      const event: ExportHtmlEvent = {
        html: '<div>Test</div>',
        design: { id: 'test' },
      };

      expect(event.html).toBe('<div>Test</div>');
      expect(event.design).toBeDefined();
    });

    it('should define ExportResult correctly', () => {
      const result: ExportResult = {
        html: '<div>Test</div>',
        design: { id: 'test' },
      };

      expect(result.html).toBe('<div>Test</div>');
      expect(result.design).toBeDefined();
    });
  });

  describe('UnlayerEditorMethods', () => {
    it('should define method signatures correctly', () => {
      const methods: UnlayerEditorMethods = {
        loadDesign: (design: Record<string, any>) => {
          // Implementation
        },
        exportHtml: async (): Promise<ExportResult> => {
          return { html: '', design: {} };
        },
      };

      expect(typeof methods.loadDesign).toBe('function');
      expect(typeof methods.exportHtml).toBe('function');
    });
  });
});
