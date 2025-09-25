'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';

import React from 'react';
import './globals.css';
import './video-banner.css';
import './style.css';

import SvgBackground from '@/components/SvgBackground';
import BottomNav from '@/components/BottomNav';
import '@/components/BottomNav.css';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SvgBackground />
        <AuthProvider>
          <CheckboxProvider>
            <GlobalCartProvider>
                <ChakraProvider>
                  <Header />
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
