import { useLayoutEffect, RefObject } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollRestoration(scrollRef?: RefObject<HTMLElement>) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const savedPosition = sessionStorage.getItem(`scrollPos_${pathname}`);
    if (savedPosition !== null) {
      const parsedPosition = parseInt(savedPosition, 10);

      let attempts = 0;
      const maxAttempts = 10;
      const interval = 100;

      const restoreScroll = () => {
        attempts++;
        const targetElement = scrollRef?.current || window;
        const scrollableHeight = scrollRef?.current ? scrollRef.current.scrollHeight - scrollRef.current.clientHeight : document.documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight >= parsedPosition) {
          if (targetElement === window) {
            window.scrollTo(0, parsedPosition);
          } else if (scrollRef?.current) {
            scrollRef.current.scrollTop = parsedPosition;
          }
        } else if (attempts < maxAttempts) {
          setTimeout(restoreScroll, interval);
        }
      };

      const timeoutId = setTimeout(restoreScroll, 100);

      return () => clearTimeout(timeoutId);
    }

    return () => {
      const scrollY = scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY;
      sessionStorage.setItem(`scrollPos_${pathname}`, scrollY.toString());
    };
  }, [pathname, scrollRef]);
}