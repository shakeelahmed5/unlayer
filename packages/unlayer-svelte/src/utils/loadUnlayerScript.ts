let _promise: Promise<void> | null = null;

export function loadUnlayerScript(
  src = 'https://editor.unlayer.com/embed.js'
): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  if ((window as any).unlayer) return Promise.resolve();
  if (_promise) return _promise;

  _promise = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('Failed to load Unlayer script'));
    document.head.appendChild(el);
  });

  return _promise;
}
