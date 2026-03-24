'use client';

import { usePathname } from 'next/navigation';
import FloatingBackButton from './FloatingBackButton';

export default function FloatingBackButtonWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) return null;
  return <FloatingBackButton />;
}
