import { useState, useEffect, useRef } from 'react';

export const useResizeObserver = (viewMode: string) => {
  const [containerWidths, setContainerWidths] = useState<{ [key: string]: number }>({});
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserver = useRef<ResizeObserver | null>(null);

  // Initialize ResizeObserver once
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const newWidths: { [key: string]: number } = {};
      entries.forEach((entry) => {
        const clientId = entry.target.getAttribute('data-client-id');
        if (clientId) {
          newWidths[clientId] = entry.contentRect.width;
        }
      });
      setContainerWidths(prev => ({ ...prev, ...newWidths }));
    });

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []); // Only create observer once

  // Update observers when view mode changes
  useEffect(() => {
    if (resizeObserver.current && viewMode === 'grid') {
      // Disconnect existing observations
      resizeObserver.current.disconnect();
      
      // Observe all current container refs
      Object.entries(containerRefs.current).forEach(([clientId, element]) => {
        if (element) {
          resizeObserver.current?.observe(element);
          // Initial width measurement
          setContainerWidths(prev => ({
            ...prev,
            [clientId]: element.offsetWidth
          }));
        }
      });
    }
  }, [viewMode]);

  return {
    containerWidths,
    containerRefs,
  };
};
