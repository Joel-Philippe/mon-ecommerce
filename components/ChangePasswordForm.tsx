'use client';
import React from 'react';
import { Box, Text, Button, useToast } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

const ChangePasswordForm = () => {
  const auth = useAuth();
  const user = auth?.user;
  const resetPassword = auth?.resetPassword;
  const toast = useToast();

  const handlePasswordReset = async () => {
    if (!user || !user.email || !resetPassword) return;

    try {
      await resetPassword(user.email);
      toast({
        title: 'Email de réinitialisation envoyé.',
        description: `Un email a été envoyé à ${user.email} pour réinitialiser votre mot de passe.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      let message = 'An unknown error occurred.';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: 'Erreur',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text mb={4}>
        Cliquez ci-dessous pour réinitialiser votre mot de passe. Un email sera envoyé à {user?.email}.
      </Text>
      <Button onClick={handlePasswordReset} background={'#e15600'} colorScheme="teal" width="full">
        Réinitialiser le mot de passe
      </Button>
    </Box>
  );
};

export default ChangePasswordForm;
