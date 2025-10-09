import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import '../app/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      background="rgb(255, 246, 241)"
      zIndex="1000"
    >
      <Box textAlign="center">
        <span className="loader"></span>
      </Box>
    </Flex>
  );
};

export default LoadingSpinner;

