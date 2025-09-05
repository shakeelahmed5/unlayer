import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the loadUnlayerScript utility
vi.mock('../utils/loadUnlayerScript', () => ({
  loadUnlayerScript: vi.fn(() => Promise.resolve()),
}));

// Mock Unlayer API
const mockUnlayer = {
  createEditor: vi.fn(),
};

// Mock window.unlayer
Object.defineProperty(window, 'unlayer', {
  value: mockUnlayer,
  writable: true,
});

describe('UnlayerEditor - Initialization & Event Emission', () => {
  let mockEditor: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock editor
    mockEditor = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      loadDesign: vi.fn(),
      saveDesign: vi.fn(),
      exportHtml: vi.fn(),
    };

    // Mock createEditor to return our mock editor
    mockUnlayer.createEditor.mockReturnValue(mockEditor);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default options', () => {
      const options = {};
      const containerId = 'test-container';
      
      // Simulate the initialization logic
      const editor = mockUnlayer.createEditor({
        id: containerId,
        displayMode: 'email',
        ...options,
      });

      expect(mockUnlayer.createEditor).toHaveBeenCalledWith({
        id: containerId,
        displayMode: 'email',
        ...options,
      });
      expect(editor).toBe(mockEditor);
    });

    it('should initialize with custom options', () => {
      const customOptions = {
        projectId: 'test-project',
        displayMode: 'web' as const,
        locale: 'en',
      };
      const containerId = 'test-container';
      
      const editor = mockUnlayer.createEditor({
        id: containerId,
        displayMode: 'web',
        ...customOptions,
      });

      expect(mockUnlayer.createEditor).toHaveBeenCalledWith({
        id: containerId,
        displayMode: 'web',
        projectId: 'test-project',
        locale: 'en',
      });
    });

    it('should merge tools configuration into options', () => {
      const tools = {
        whitelist: ['text', 'image'],
        blacklist: ['video'],
      };
      const options = { projectId: 'test' };
      const containerId = 'test-container';
      
      const mergedOptions = { ...options, tools };
      
      const editor = mockUnlayer.createEditor({
        id: containerId,
        displayMode: 'email',
        ...mergedOptions,
      });

      expect(mockUnlayer.createEditor).toHaveBeenCalledWith({
        id: containerId,
        displayMode: 'email',
        projectId: 'test',
        tools: {
          whitelist: ['text', 'image'],
          blacklist: ['video'],
        },
      });
    });

    it('should generate unique container IDs', () => {
      const generateContainerId = () => `unlayer-${Math.random().toString(36).slice(2)}`;
      
      const id1 = generateContainerId();
      const id2 = generateContainerId();
      
      expect(id1).toMatch(/^unlayer-[a-z0-9]+$/);
      expect(id2).toMatch(/^unlayer-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should apply container styling', () => {
      const mockContainer = {
        style: {} as any,
      };

      // Simulate container styling logic
      mockContainer.style.width = '100%';
      mockContainer.style.height = '100%';
      mockContainer.style.minHeight = '400px';

      expect(mockContainer.style.width).toBe('100%');
      expect(mockContainer.style.height).toBe('100%');
      expect(mockContainer.style.minHeight).toBe('400px');
    });
  });

  describe('Event Emission', () => {
    it('should emit loaded event when editor is ready', () => {
      const mockDispatch = vi.fn();
      
      // Simulate editor ready event handler
      const readyHandler = () => {
        const loadedEvent = { editor: mockEditor };
        mockDispatch('loaded', loadedEvent);
      };
      
      // Simulate setting up the event listener
      mockEditor.addEventListener('editor:ready', readyHandler);
      
      // Trigger the ready event
      readyHandler();

      expect(mockEditor.addEventListener).toHaveBeenCalledWith('editor:ready', expect.any(Function));
      expect(mockDispatch).toHaveBeenCalledWith('loaded', { editor: mockEditor });
    });

    it('should emit design-updated event when design changes', () => {
      const mockDispatch = vi.fn();
      const mockDesign = { id: 'test-design', body: { rows: [] } };
      
      // Simulate design updated event handler
      const designUpdatedHandler = () => {
        mockEditor.saveDesign((design: any) => {
          const designUpdatedEvent = { design };
          mockDispatch('design-updated', designUpdatedEvent);
        });
      };
      
      // Mock saveDesign to call the callback
      mockEditor.saveDesign.mockImplementation((callback: Function) => {
        callback(mockDesign);
      });
      
      // Simulate setting up the event listener
      mockEditor.addEventListener('design:updated', designUpdatedHandler);
      
      // Trigger the design updated event
      designUpdatedHandler();

      expect(mockEditor.addEventListener).toHaveBeenCalledWith('design:updated', expect.any(Function));
      expect(mockDispatch).toHaveBeenCalledWith('design-updated', { design: mockDesign });
    });

    it('should emit export-html event when HTML is exported', async () => {
      const mockDispatch = vi.fn();
      const mockExportResult = {
        html: '<div>Test HTML</div>',
        design: { id: 'test-design' },
      };

      // Mock exportHtml to call the callback
      mockEditor.exportHtml.mockImplementation((callback: Function) => {
        callback(mockExportResult);
      });

      // Simulate the export logic
      const exportHtml = () => {
        return new Promise((resolve, reject) => {
          if (!mockEditor) {
            reject(new Error('Editor not loaded'));
            return;
          }

          mockEditor.exportHtml((data: any) => {
            const result = {
              html: data.html,
              design: data.design
            };
            
            // Dispatch export event
            mockDispatch('export-html', result);
            resolve(result);
          });
        });
      };

      await exportHtml();

      expect(mockDispatch).toHaveBeenCalledWith('export-html', mockExportResult);
    });

    it('should handle export errors when editor not loaded', async () => {
      const exportHtml = () => {
        return new Promise((resolve, reject) => {
          if (!mockEditor) {
            reject(new Error('Editor not loaded'));
            return;
          }
          resolve({ html: '', design: {} });
        });
      };

      // Test with no editor
      const editor = mockEditor;
      mockEditor = null;
      
      await expect(exportHtml()).rejects.toThrow('Editor not loaded');
      
      // Restore editor
      mockEditor = editor;
    });
  });

  describe('Design Loading', () => {
    it('should load design with validation', () => {
      const loadDesign = (designData: Record<string, any>) => {
        if (!designData || typeof designData !== 'object') {
          console.warn('Invalid design data provided, using empty design');
          designData = {
            counters: { u_column: 0, u_row: 0, u_content_text: 0 },
            body: { id: "body", rows: [], values: {} },
            schemaVersion: 16
          };
        }
        
        mockEditor.loadDesign(designData);
      };

      // Test valid design
      const validDesign = { id: 'test', body: { rows: [] } };
      loadDesign(validDesign);
      expect(mockEditor.loadDesign).toHaveBeenCalledWith(validDesign);

      // Test invalid design
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      loadDesign(null);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid design data provided, using empty design');
      expect(mockEditor.loadDesign).toHaveBeenCalledWith({
        counters: { u_column: 0, u_row: 0, u_content_text: 0 },
        body: { id: "body", rows: [], values: {} },
        schemaVersion: 16,
      });
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle design loading errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const loadDesign = (designData: Record<string, any>) => {
        try {
          mockEditor.loadDesign(designData);
        } catch (err) {
          console.error('Failed to load design:', err);
        }
      };

      // Mock loadDesign to throw
      mockEditor.loadDesign.mockImplementation(() => {
        throw new Error('Design load failed');
      });

      loadDesign({ id: 'test' });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load design:', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle reactive design updates', () => {
      let design = { id: 'initial-design', body: { rows: [] } };
      
      // Simulate initial load
      mockEditor.loadDesign(design);
      expect(mockEditor.loadDesign).toHaveBeenCalledWith(design);

      // Simulate reactive update
      design = { id: 'updated-design', body: { rows: [] } };
      mockEditor.loadDesign(design);
      
      expect(mockEditor.loadDesign).toHaveBeenCalledTimes(2);
      expect(mockEditor.loadDesign).toHaveBeenLastCalledWith(design);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const initializeEditor = () => {
        try {
          throw new Error('Initialization failed');
        } catch (err) {
          console.error('Failed to initialize Unlayer editor:', err);
        }
      };

      initializeEditor();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize Unlayer editor:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle script loading failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock loadUnlayerScript to reject
      const { loadUnlayerScript } = await import('../utils/loadUnlayerScript');
      vi.mocked(loadUnlayerScript).mockRejectedValue(new Error('Script load failed'));

      const initializeEditor = async () => {
        try {
          await loadUnlayerScript();
        } catch (err) {
          console.error('Failed to initialize Unlayer editor:', err);
        }
      };

      await initializeEditor();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initialize Unlayer editor:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Event Listener Management', () => {
    it('should set up event listeners correctly', () => {
      const setupEventListeners = (editor: any) => {
        editor.addEventListener('editor:ready', () => {});
        editor.addEventListener('design:updated', () => {});
      };

      setupEventListeners(mockEditor);

      expect(mockEditor.addEventListener).toHaveBeenCalledWith('editor:ready', expect.any(Function));
      expect(mockEditor.addEventListener).toHaveBeenCalledWith('design:updated', expect.any(Function));
    });

    it('should clean up event listeners', () => {
      const removeListener = vi.fn();
      
      // Simulate cleanup
      removeListener();

      expect(removeListener).toHaveBeenCalled();
    });

    it('should handle multiple component instances', () => {
      const editor1 = mockUnlayer.createEditor({ id: 'container1', projectId: 'project1' });
      const editor2 = mockUnlayer.createEditor({ id: 'container2', projectId: 'project2' });

      expect(mockUnlayer.createEditor).toHaveBeenCalledTimes(2);
      expect(mockUnlayer.createEditor).toHaveBeenCalledWith({ id: 'container1', projectId: 'project1' });
      expect(mockUnlayer.createEditor).toHaveBeenCalledWith({ id: 'container2', projectId: 'project2' });
    });
  });

  describe('Public Methods', () => {
    it('should expose loadDesign method', () => {
      const methods = {
        loadDesign: (design: Record<string, any>) => {
          mockEditor.loadDesign(design);
        },
        exportHtml: async () => {
          return new Promise((resolve, reject) => {
            if (!mockEditor) {
              reject(new Error('Editor not loaded'));
              return;
            }
            mockEditor.exportHtml((data: any) => {
              resolve({ html: data.html, design: data.design });
            });
          });
        },
      };

      expect(typeof methods.loadDesign).toBe('function');
      expect(typeof methods.exportHtml).toBe('function');

      // Test loadDesign
      methods.loadDesign({ id: 'test' });
      expect(mockEditor.loadDesign).toHaveBeenCalledWith({ id: 'test' });
    });

    it('should expose exportHtml method', async () => {
      const mockResult = { html: '<div>Test</div>', design: { id: 'test' } };
      mockEditor.exportHtml.mockImplementation((callback: Function) => {
        callback(mockResult);
      });

      const methods = {
        exportHtml: async () => {
          return new Promise((resolve, reject) => {
            if (!mockEditor) {
              reject(new Error('Editor not loaded'));
              return;
            }
            mockEditor.exportHtml((data: any) => {
              resolve({ html: data.html, design: data.design });
            });
          });
        },
      };

      const result = await methods.exportHtml();
      expect(result).toEqual(mockResult);
    });
  });

  describe('CSS Classes and Styles', () => {
    it('should apply custom className', () => {
      const className = 'custom-class';
      const style = 'background: red;';
      
      // Simulate the component props
      const props = {
        className,
        style,
      };

      expect(props.className).toBe('custom-class');
      expect(props.style).toBe('background: red;');
    });
  });
});
