'use client';
import { useEffect, useState } from 'react';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { useSearchParams } from 'next/navigation';
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionHeading = motion(Heading);

const SuccessPage = () => {
  const { clearCart } = useGlobalCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Success page loaded, clearing cart...");
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/order-details?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.customer_email) {
            setCustomerEmail(data.customer_email);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching order details:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, #fefcea, #f1daff)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={6}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="2xl"
        boxShadow="xl"
        maxW="500px"
        textAlign="center"
      >
        <CheckCircleIcon boxSize={12} color="green.400" mb={4} />

        <MotionHeading
          size="lg"
          mb={4}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Merci pour votre achat ! 🎉
        </MotionHeading>

        <Text fontSize="md" color="gray.600">
          Votre commande a bien été enregistrée. Un email de confirmation vous sera envoyé à{' '}
          {isLoading ? '...' : customerEmail || 'votre adresse email'}.
        </Text>

        <VStack spacing={4} mt={2}>
          <Link href="/">
            <Button variant="outline" width="100%">
              Retour à l'accueil
            </Button>
          </Link>
        </VStack>
      </Box>
    </Box>
  );
};

export default SuccessPage;
