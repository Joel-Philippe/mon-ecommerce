'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext'; // Assurez-vous que le chemin est correct
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import './globals.css';
import './video-banner.css';
import './style.css';

import FixedCartButton from '@/components/FixedCartButton';
import SvgBackground from '@/components/SvgBackground';

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
                {children}
                <FixedCartButton />
              </ChakraProvider>
            </GlobalCartProvider>
          </CheckboxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
