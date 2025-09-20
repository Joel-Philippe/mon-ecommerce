'use client';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalCartProvider } from '@/components/GlobalCartContext';
import theme from './theme';
import '../app/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <GlobalCartProvider>
          <Component {...pageProps} />
        </GlobalCartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;