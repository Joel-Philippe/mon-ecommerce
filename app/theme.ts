import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'system', // or 'light' | 'dark'
    useSystemColorMode: true,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'black' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'black',
      },
    }),
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