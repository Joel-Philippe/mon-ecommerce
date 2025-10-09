'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

import React from 'react';
import './globals.css';
import './video-banner.css';
import './style.css';

import SvgBackground from '@/components/SvgBackground';
import BottomNav from '@/components/BottomNav';
import '@/components/BottomNav.css';
import ProgressBar from '@/components/ProgressBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useScrollRestoration();
  
  return (
    <html lang="fr">
      <body>
        <ProgressBar />
        <SvgBackground />
        <AuthProvider>
          <CheckboxProvider>
            <GlobalCartProvider>
                <ChakraProvider>
                  {children}
                  <BottomNav />
                </ChakraProvider>
            </GlobalCartProvider>
          </CheckboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
