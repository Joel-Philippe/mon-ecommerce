'use client';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '../app/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <CheckboxProvider>
          <GlobalCartProvider>
            <SearchProvider>
              <ChakraProvider theme={theme}>
                <Suspense fallback={<div>Chargement...</div>}>
                  {children}
                </Suspense>
              </ChakraProvider>
            </SearchProvider>
          </GlobalCartProvider>
        </CheckboxProvider>
      </AuthProvider>
    </>
  );
}
