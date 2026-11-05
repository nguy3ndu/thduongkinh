export async function clearRuntimeCache(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  sessionStorage.clear();
}

export function installCacheCleanup(): () => void {
  const handlePageHide = () => {
    void clearRuntimeCache();
  };

  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('unload', handlePageHide);

  return () => {
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('unload', handlePageHide);
  };
}
