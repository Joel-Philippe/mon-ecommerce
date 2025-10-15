"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Heading,
  Link as ChakraLink,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import Confetti from 'react-confetti';
import { FaGoogle } from 'react-icons/fa';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const authContext = useAuth();

  if (!authContext) {
    return null;
  }
  const { signup, signInWithGoogle } = authContext;

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName, photoFile);
      setLoading(false);
      setShowForm(false);
      onOpen();
      setTimeout(() => {
        onClose();
        router.push('/consumers');
      }, 3000);
    } catch (error: unknown) {
      setLoading(false);
      console.error('Firebase signup error:', error);
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const firebaseError = error as { code: string };
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setError(`L'adresse email ${email} est déjà utilisée pour un autre compte.`);
            break;
          case 'auth/invalid-email':
            setError("L'adresse email n'est pas valide.");
            break;
          case 'auth/weak-password':
            setError("Le mot de passe est trop faible.");
            break;
          case 'auth/account-exists-with-different-credential':
            setError("Un compte avec cet email existe déjà avec un autre fournisseur.");
            break;
          default:
            setError(`Erreur lors de la création du compte: ${firebaseError.code}`);
        }
      } else {
        setError('Une erreur inattendue est survenue. Veuillez réessayer.');
      }
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
      {loading ? (
        <Flex minHeight="50vh" align="center" justify="center" bg="rgb(255, 246, 241)" px={4}>
          <Text>Bienvenue !</Text>
          <Text>Votre compte a été créé avec succès.</Text>
          <Confetti />
        </Flex>
      ) : showForm ? (
        <Flex minHeight="50vh" align="center" justify="center" bg="white" px={4}>
          <Box width={{ base: 'full', md: 'md' }} p={2} borderWidth={0} borderRadius={8} bg="white">
            <Heading as="h1" size="lg" mb={6} textAlign="center" color="black">
              Inscription
            </Heading>

            <VStack spacing={4} mb={6}>
              <Button
                w="full"
                colorScheme="red"
                leftIcon={<FaGoogle />}
                onClick={handleGoogleSignIn}
              >
                S'inscrire avec Google
              </Button>
            </VStack>

            <HStack w="full" mb={6}>
              <Divider />
              <Text color="gray.500" whiteSpace="nowrap">
                ou
              </Text>
              <Divider />
            </HStack>

            <form onSubmit={handleSignup}>
              <FormControl id="email" isRequired mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                <FormLabel>Mot de passe</FormLabel>
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
              <FormControl id="confirm-password" isRequired mb={4}>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <Input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <FormControl id="display-name" mb={4}>
                <FormLabel>Pseudo</FormLabel>
                <Input
                  type="text"
                  placeholder="Pseudo"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
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
              {error && (
                <Alert status="error" mb={4}>
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
                M&apos;inscrire
              </Button>
            </form>
            <Flex justifyContent="space-between">
              <NextLink href="/login" passHref legacyBehavior>
                <ChakraLink colorScheme="teal" variant="link">
                  Déjà un compte? Se connecter
                </ChakraLink>
              </NextLink>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Bienvenue !</ModalHeader>
            <ModalBody>
              <Text>Votre compte a été créé avec succès.</Text>
              <Confetti />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
