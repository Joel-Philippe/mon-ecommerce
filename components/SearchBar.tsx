'use client';
import React, { useEffect } from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  IconButton,
  Box,
  SystemStyleObject,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Rechercher un article...",
  className = "",
}) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const containerStyles: SystemStyleObject = {
    position: "relative",
    zIndex: 2,
    width: "100%",
    margin: "0 auto",
  };

  const inputStyles: SystemStyleObject = {
    border: "none",
    backdropFilter: "blur(10px)",
    borderRadius: "30px",
    bg: useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(26, 32, 44, 0.7)"),
    '::placeholder': {
      color: useColorModeValue("#FF6F00", "gray.400"),
    },
    _hover: {
      borderColor: "transparent",
    },
    _focus: {
      borderColor: "transparent",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.15)",
      background: useColorModeValue("white", "gray.700"),
      transform: "translateY(-2px)",
      zIndex: 1,
    },
    transition: "all 0.3s ease",
  };

  return (
    <Box as="div" sx={containerStyles} className={className}>
      <InputGroup>
        <InputLeftElement pointerEvents="none" color="var(--search-icon-color)">
          <FaSearch />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          sx={inputStyles}
        />
        {searchTerm && (
          <InputRightElement>
            <IconButton
              aria-label="Effacer la recherche"
              icon={<X size={16} />}
              size="sm"
              isRound
              variant="ghost"
              onClick={clearSearch}
              _hover={{ color: 'gray.700', bg: 'gray.200' }}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
