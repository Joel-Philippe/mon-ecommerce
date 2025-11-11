'use client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import { SearchProvider } from '@/contexts/SearchContext';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import './video-banner.css';
import './style.css';


import BottomNav from '@/components/BottomNav';
import FloatingBackButton from '@/components/FloatingBackButton'; // Import FloatingBackButton
import '@/components/BottomNav.css';
import ProgressBar from '@/components/ProgressBar';
import ScrollRestoration from '@/components/ScrollRestoration';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get the current pathname
  const isAdminPage = pathname === '/admin'; // Check if it's the admin page
  const isHomePage = pathname === '/'; // Check if it's the home page

  return (
    <html lang="fr">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ProgressBar />
        <ScrollRestoration />

        <AuthProvider>
          <CheckboxProvider>
            <GlobalCartProvider>
              <SearchProvider>
                <ChakraProvider theme={theme}>
                  <Suspense fallback={<div>Chargement...</div>}>
                    {!isHomePage && <FloatingBackButton />} {/* Conditionally render FloatingBackButton */}
                    {children}
                  </Suspense>
                  {!isAdminPage && <BottomNav />} {/* Conditionally render BottomNav */}
                </ChakraProvider>
              </SearchProvider>
            </GlobalCartProvider>
          </CheckboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
