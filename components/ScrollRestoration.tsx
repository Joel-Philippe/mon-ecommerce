'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollRestoration = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Restore scroll position when navigating to a new page
    const savedScrollY = sessionStorage.getItem(`scrollPos_${pathname}`);
    if (savedScrollY) {
      window.scrollTo(0, parseInt(savedScrollY, 10));
      console.log(`[ScrollRestoration] Restored scroll for ${pathname}: ${savedScrollY}`);
    } else {
      // If no saved position, scroll to top (default Next.js behavior)
      window.scrollTo(0, 0);
      console.log(`[ScrollRestoration] No saved scroll for ${pathname}, scrolling to top.`);
    }
  }, [pathname]);

  return null;
};

export default ScrollRestoration;
