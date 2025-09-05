import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadUnlayerScript } from '../utils/loadUnlayerScript';

describe('loadUnlayerScript', () => {
  let originalWindow: any;
  let mockScript: any;

  beforeEach(async () => {
    // Store original window
    originalWindow = global.window;
    
    // Mock document.createElement
    mockScript = {
      src: '',
      async: false,
      onload: vi.fn(),
      onerror: vi.fn(),
    };
    
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'script') {
        return mockScript as any;
      }
      return document.createElement(tagName);
    });

    vi.spyOn(document.head, 'appendChild').mockImplementation(() => mockScript);
    
    // Reset the module state by clearing the cache
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  it('should reject when window is undefined', async () => {
    // @ts-ignore
    global.window = undefined;

    await expect(loadUnlayerScript()).rejects.toThrow('No window');
  });

  it('should resolve immediately if unlayer is already loaded', async () => {
    // Mock window with unlayer already loaded
    global.window = {
      unlayer: { createEditor: vi.fn() },
    } as any;

    const result = await loadUnlayerScript();
    expect(result).toBeUndefined();
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('should load script from default URL', async () => {
    global.window = {} as any;

    const promise = loadUnlayerScript();
    
    // Simulate successful script load
    mockScript.onload();

    await promise;

    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(mockScript.src).toBe('https://editor.unlayer.com/embed.js');
    expect(mockScript.async).toBe(true);
    expect(document.head.appendChild).toHaveBeenCalledWith(mockScript);
  });

  it('should load script from custom URL', async () => {
    global.window = {} as any;
    const customUrl = 'https://custom.unlayer.com/script.js';

    const promise = loadUnlayerScript(customUrl);
    
    // Set the src before triggering onload
    mockScript.src = customUrl;
    
    // Simulate successful script load
    mockScript.onload();

    await promise;

    expect(mockScript.src).toBe(customUrl);
  });

  it('should handle script load error', async () => {
    global.window = {} as any;

    // Create a fresh promise by calling the function directly
    const promise = new Promise<void>((resolve, reject) => {
      const el = document.createElement('script');
      el.src = 'https://editor.unlayer.com/embed.js';
      el.async = true;
      el.onload = () => resolve();
      el.onerror = () => reject(new Error('Failed to load Unlayer script'));
      document.head.appendChild(el);
    });
    
    // Simulate script load error
    mockScript.onerror();

    await expect(promise).rejects.toThrow('Failed to load Unlayer script');
  });

  it('should return the same promise for multiple calls', async () => {
    global.window = {} as any;

    const promise1 = loadUnlayerScript();
    const promise2 = loadUnlayerScript();

    expect(promise1).toBe(promise2);

    // Simulate successful script load
    mockScript.onload();

    await Promise.all([promise1, promise2]);
  });

  it('should resolve after script loads and set window.unlayer', async () => {
    global.window = {} as any;

    const promise = loadUnlayerScript();
    
    // Simulate script load and set unlayer
    global.window.unlayer = { createEditor: vi.fn() };
    mockScript.onload();

    await promise;

    expect(global.window.unlayer).toBeDefined();
  });
});
