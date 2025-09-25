'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, cloneElement, isValidElement } from 'react'; // Import cloneElement and isValidElement

interface ScrollRestorationLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

const ScrollRestorationLink: React.FC<ScrollRestorationLinkProps> = ({ children, onClick, ...props }) => {
  const pathname = usePathname();

  console.log(`[ScrollRestorationLink] Rendered for pathname: ${pathname}, href: ${props.href}`);

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    // Save scroll position immediately on click, before any default Link behavior or custom onClick
    const scrollYToSave = window.scrollY;
    sessionStorage.setItem(`scrollPos_${pathname}`, scrollYToSave.toString());
    console.log(`[ScrollRestorationLink] Saving scroll for ${pathname} on click: ${scrollYToSave}, target href: ${props.href}`);
    
    if (onClick) {
      onClick(event);
    }
  }, [onClick, pathname, props.href]); // Added props.href to dependencies

  // If legacyBehavior is true, onClick must be on the child
  if (props.legacyBehavior && isValidElement(children)) {
    return (
      <Link {...props}>
        {cloneElement(children, { onClick: handleClick })}
      </Link>
    );
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ScrollRestorationLink;