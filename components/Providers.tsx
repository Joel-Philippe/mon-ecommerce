'use client';

import { ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react';
import theme from '../app/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { CheckboxProvider } from '@/contexts/CheckboxContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { Suspense, useEffect } from 'react';
import { DARK_APP_BACKGROUND, LIGHT_APP_BACKGROUND } from '@/app/theme';

function ThemeSync() {
  const { colorMode } = useColorMode();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
    document.documentElement.style.colorScheme = colorMode;

    const themeColor = colorMode === 'dark' ? DARK_APP_BACKGROUND : LIGHT_APP_BACKGROUND;
    let metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }, [colorMode]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <CheckboxProvider>
          <GlobalCartProvider>
            <SearchProvider>
              <ChakraProvider theme={theme}>
                <ThemeSync />
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
