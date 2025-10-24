import React from 'react';
import { useRouter } from 'next/navigation';
import { Flex, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import './FixedHeader.css';

interface FixedHeaderProps {
  title?: string;
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ title }) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('#e63198', 'white');

  return (
    <Flex
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="99999"
      alignItems="center"
      p="4"
      bg={bgColor}
      color={textColor}
      boxShadow="sm"
      className="fixed-header"
    >
      <IconButton
        aria-label="Retour"
        icon={<FiArrowLeft size={24} />}
        onClick={() => router.back()}
        variant="ghost"
        color={textColor}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
      />
      {title && <h1 className="header-title">{title}</h1>}
    </Flex>
  );
};

export default FixedHeader;
