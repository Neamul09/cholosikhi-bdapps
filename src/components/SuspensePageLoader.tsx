import { useEffect } from 'react';

/**
 * SuspensePageLoader
 * Dispatches top progress bar events during lazy-loaded bundle downloads.
 */
export default function SuspensePageLoader() {
  useEffect(() => {
    window.dispatchEvent(new Event('cs_route_loading_start'));
    return () => {
      window.dispatchEvent(new Event('cs_route_loading_done'));
    };
  }, []);

  return null;
}
