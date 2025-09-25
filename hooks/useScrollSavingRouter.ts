'use client';

import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useScrollSavingRouter() {
  const router = useNextRouter();

  const saveScrollPosition = useCallback(() => {
    const pathname = window.location.pathname;
    const scrollYToSave = window.scrollY;
    sessionStorage.setItem(`scrollPos_${pathname}`, scrollYToSave.toString());
    console.log(`[useScrollSavingRouter] Saving scroll for ${pathname} programmatically: ${scrollYToSave}`);
  }, []);

  const push = useCallback((href: string, options?: Parameters<typeof useNextRouter>['0']['push']['1']) => {
    saveScrollPosition();
    router.push(href, options);
  }, [router, saveScrollPosition]);

  const replace = useCallback((href: string, options?: Parameters<typeof useNextRouter>['0']['replace']['1']) => {
    saveScrollPosition();
    router.replace(href, options);
  }, [router, saveScrollPosition]);

  return {
    ...router,
    push,
    replace,
  };
}
