'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

interface FloatingBackButtonProps {
  // No props needed for now
}

const FloatingBackButton: React.FC<FloatingBackButtonProps> = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const handleBack = () => {
    router.back();
  };

  const bgColor = colorMode === 'light' ? 'blue.500' : 'gray.700';
  const hoverBgColor = colorMode === 'light' ? 'blue.600' : 'gray.600';
  const iconColor = 'white';

  return (
    <IconButton
      icon={<ChevronLeftIcon w={6} h={6} />}
      aria-label="Go back"
      onClick={handleBack}
      position="fixed"
      top="20px" // Position at the top
      left="20px" // Position at the left
      zIndex="tooltip" // Ensure it's above other content
      bg={bgColor}
      color={iconColor}
      _hover={{ bg: hoverBgColor }}
      borderRadius="full" // Make it circular
      boxShadow="lg" // Add a larger shadow for prominence
      size="lg" // Make it a bit larger
    />
  );
};

export default FloatingBackButton;
