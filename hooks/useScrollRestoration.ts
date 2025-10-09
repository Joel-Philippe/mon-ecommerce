import { useLayoutEffect, useEffect, RefObject } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollRestoration(scrollRef?: RefObject<HTMLElement>, dependency?: any) {
  const pathname = usePathname();

  // Effect for RESTORING scroll position
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scrollPos_${pathname}`);
    console.log(`[useScrollRestoration] Attempting to restore scroll for ${pathname}. Saved position: ${savedPosition}`);

    if (savedPosition !== null) {
      const parsedPosition = parseInt(savedPosition, 10);

      let attempts = 0;
      const maxAttempts = 20;
      const interval = 100;

      const restoreScroll = () => {
        attempts++;
        const targetElement = scrollRef?.current || window;
        const scrollableHeight = scrollRef?.current
          ? scrollRef.current.scrollHeight - scrollRef.current.clientHeight
          : document.documentElement.scrollHeight - window.innerHeight;

        console.log(`[useScrollRestoration] Restore attempt ${attempts} for ${pathname}. Target: ${targetElement === window ? 'window' : 'ref'}. Parsed position: ${parsedPosition}. Scrollable height: ${scrollableHeight}`);

        if (scrollableHeight >= parsedPosition) {
          if (targetElement === window) {
            window.scrollTo(0, parsedPosition);
            console.log(`[useScrollRestoration] Scrolled window to ${parsedPosition}`);
          } else if (scrollRef?.current) {
            scrollRef.current.scrollTop = parsedPosition;
            console.log(`[useScrollRestoration] Scrolled ref to ${parsedPosition}`);
          }
        } else if (attempts < maxAttempts) {
          setTimeout(restoreScroll, interval);
          console.log(`[useScrollRestoration] Retrying restore in ${interval}ms`);
        } else {
          console.log(`[useScrollRestoration] Max attempts reached for ${pathname}. Could not restore scroll.`);
        }
      };

      const timeoutId = setTimeout(restoreScroll, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, dependency]);

  // Effect for SAVING scroll position
  // Removed as ScrollRestorationLink and useScrollSavingRouter handle this.
  // useEffect(() => {
  //   const handleSaveScroll = () => {
  //     const scrollY = scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY;
  //     sessionStorage.setItem(`scrollPos_${pathname}`, scrollY.toString());
  //   };

  //   // Save scroll position when the user leaves the page
  //   window.addEventListener('beforeunload', handleSaveScroll);

  //   // Return a cleanup function that saves scroll when the component unmounts (i.e., path changes)
  //   return () => {
  //     window.removeEventListener('beforeunload', handleSaveScroll);
  //     handleSaveScroll(); // Save position on navigation
  //   };
  // }, [pathname, scrollRef]); // Reruns only when the page instance changes
}