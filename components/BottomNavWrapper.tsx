'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function BottomNavWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  if (isAdminPage) return null;
  return <BottomNav />;
}
