import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'system', // or 'light' | 'dark'
    useSystemColorMode: true,
  },
  colors: {
    // Define your light and dark mode colors here
    // Example:
    // light: {
    //   background: '#ffffff',
    //   text: '#000000',
    // },
    // dark: {
    //   background: '#1a202c',
    //   text: '#ffffff',
    // },
  },
  // Add your theme customizations here
  // For example:
  // colors: {
  //   brand: {
  //     500: '#3182ce',
  //   },
  // },
  // fonts: {
  //   heading: 'Arial, sans-serif',
  //   body: 'Arial, sans-serif',
  // },
});

export default theme;