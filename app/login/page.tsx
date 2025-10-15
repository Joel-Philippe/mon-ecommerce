"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  FormControl,
  Input,
  Button,
  Alert,
  AlertIcon,
  Heading,
  Checkbox,
  Link as ChakraLink,
  VStack,
  HStack,
  Divider,
  Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }
  const { login, signInWithGoogle } = authContext;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(username, password);
      if (username === 'philippejoel.wolff@gmail.com') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Identifiant ou mot de passe erroné');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error) {
      setError('Erreur lors de la connexion avec Google.');
      console.error(error);
    }
  };

  return (
    <>
      <Flex
        minHeight="100vh" 
        align="center" 
        justify="center" 
        bg="rgb(255, 246, 241)" 
        px={4}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        >
        <Box width={{ base: 'full', md: 'md' }} p={8} borderWidth={0} borderRadius={8} bg="white" opacity={0.9}>
          <Heading as="h1" size="lg" mb={6} textAlign="center" color={'black'}>
            Connexion
          </Heading>
          
          <VStack spacing={4}>
            <Button
              w="full"
              colorScheme="red"
              leftIcon={<FaGoogle />}
              onClick={handleGoogleSignIn}
            >
              Continuer avec Google
            </Button>

            <HStack w="full">
              <Divider />
              <Text color="gray.500" whiteSpace="nowrap">
                ou
              </Text>
              <Divider />
            </HStack>
          </VStack>

          <form onSubmit={handleLogin}>
            <FormControl id="username" isRequired mb={4} mt={4}>
              <Input
                type="text"
                placeholder="Identifiant (email)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '::placeholder': {
                    fontSize: '16px',
                    fontStyle: 'italic',
                    fontWeight: '200',
                    lineHeight: '19.36px',
                    textAlign: 'left',
                    color: 'black'
                  },
                  '&:focus': {
                    borderColor: 'bisque',
                    boxShadow: '0 0 0 1px bisque',
                  },
                }}
              />
            </FormControl>
            <FormControl id="password" isRequired mb={4}>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '::placeholder': {
                    fontSize: '16px',
                    fontStyle: 'italic',
                    fontWeight: '200',
                    lineHeight: '19.36px',
                    textAlign: 'left',
                    color: 'black'
                  },
                  '&:focus': {
                    borderColor: 'bisque',
                    boxShadow: '0 0 0 1px bisque',
                  },
                }}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4} fontWeight="600">
              <Checkbox isChecked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
                Se souvenir de moi
              </Checkbox>
            </FormControl>
            {error && (
              <Alert status="error" mb={10}>
                <AlertIcon />
                {error}
              </Alert>
            )}
              <Button 
                type="submit" 
                color="black" 
                bg="white" 
                colorScheme="teal" 
                width="full" 
                mb={10}
                _hover={{ color:'white', bg: 'black' }}
              >
                Me connecter
              </Button>
          </form>
          <Flex fontSize={"13px"} justifyContent="space-between">
            <NextLink href="/signup" passHref legacyBehavior>
              <ChakraLink colorScheme="#FF9800" variant="link">
                Créer un compte
              </ChakraLink>
            </NextLink>
            <NextLink href="/forgot-password" passHref legacyBehavior>
              <ChakraLink colorScheme="teal" variant="link">
                Mot de passe oublié ?
              </ChakraLink>
            </NextLink>
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
