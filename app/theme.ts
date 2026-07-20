import { extendTheme, type StyleFunctionProps } from '@chakra-ui/react';

export const LIGHT_APP_BACKGROUND = '#fbf3f1';
export const DARK_APP_BACKGROUND = '#000000';

const theme = extendTheme({
  config: {
    initialColorMode: 'system', // or 'light' | 'dark'
    useSystemColorMode: true,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      html: {
        bg: props.colorMode === 'dark' ? DARK_APP_BACKGROUND : LIGHT_APP_BACKGROUND,
      },
      body: {
        bg: props.colorMode === 'dark' ? DARK_APP_BACKGROUND : LIGHT_APP_BACKGROUND,
        color: props.colorMode === 'dark' ? 'white' : 'black',
      },
      '#__next': {
        bg: props.colorMode === 'dark' ? DARK_APP_BACKGROUND : LIGHT_APP_BACKGROUND,
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
