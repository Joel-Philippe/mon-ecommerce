'use client';

import { usePathname } from 'next/navigation';
import FloatingBackButton from './FloatingBackButton';

export default function FloatingBackButtonWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isSuccessPage = pathname === '/success';

  if (isHomePage || isSuccessPage) return null;
  return <FloatingBackButton />;
}
