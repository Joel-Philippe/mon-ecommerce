import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
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
      background={useColorModeValue("white", "black")}
      zIndex="1000"
    >
      <Box textAlign="center">
        <span className="loader"></span>
      </Box>
    </Flex>
  );
};

export default LoadingSpinner;

