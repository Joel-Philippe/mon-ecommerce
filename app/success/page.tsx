'use client';

import { useEffect, useState } from 'react';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { useSearchParams } from 'next/navigation';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Container, 
  Icon, 
  useColorModeValue,
  ScaleFade
} from "@chakra-ui/react";
import Link from "next/link";
import { CheckCircleIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import ReactConfetti from 'react-confetti';

const MotionBox = motion(Box);

// Simple hook for window size to avoid external dependencies
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const SuccessPage = () => {
  const { clearCart } = useGlobalCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  // Theme values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");
  const buttonBg = useColorModeValue("purple.600", "purple.400");
  const buttonHoverBg = useColorModeValue("purple.700", "purple.500");

  useEffect(() => {
    // Clear cart immediately on success
    clearCart();
    
    // Stop confetti after 5 seconds to save resources
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
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
    <Box minH="100vh" bg={bgColor} py={20} position="relative" overflow="hidden">
      {showConfetti && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      <Container maxW="container.sm">
        <ScaleFade initialScale={0.9} in={true}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={cardBg}
            p={10}
            borderRadius="3xl"
            boxShadow="2xl"
            textAlign="center"
            border="1px solid"
            borderColor={useColorModeValue("gray.100", "gray.700")}
          >
            <Box mb={6}>
              <Icon 
                as={CheckCircleIcon} 
                w={20} 
                h={20} 
                color="green.400" 
                filter="drop-shadow(0 0 10px rgba(72, 187, 120, 0.4))"
              />
            </Box>

            <Heading 
              as="h1" 
              size="xl" 
              mb={4} 
              color={headingColor}
              fontWeight="bold"
            >
              Merci pour votre achat ! 🎉
            </Heading>

            <Text fontSize="lg" color={textColor} mb={8} lineHeight="tall">
              C'est une excellente nouvelle ! Votre commande a été traitée avec succès. 
              {customerEmail ? (
                <> Un email de confirmation a été envoyé à <strong>{customerEmail}</strong>.</>
              ) : (
                isLoading ? <> Nous récupérons vos détails de commande...</> : <> Un email de confirmation vous sera envoyé sous peu.</>
              )}
            </Text>

            <Box 
              bg={useColorModeValue("purple.50", "rgba(128, 90, 213, 0.1)")} 
              p={4} 
              borderRadius="xl" 
              mb={10}
              border="1px dashed"
              borderColor="purple.200"
            >
              <Text fontSize="sm" fontWeight="medium" color="purple.500">
                Commande n° {sessionId?.slice(-8).toUpperCase() || "EN COURS"}
              </Text>
            </Box>

            <VStack spacing={4}>
              <Link href="/" style={{ width: '100%' }}>
                <Button
                  size="lg"
                  w="100%"
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: buttonHoverBg, transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.2s"
                  borderRadius="xl"
                  leftIcon={<ArrowBackIcon />}
                >
                  Retour à l'accueil
                </Button>
              </Link>
              
              <Text fontSize="xs" color="gray.500" mt={4}>
                Une question ? Contactez notre support à <strong>support@exercide.com</strong>
              </Text>
            </VStack>
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default SuccessPage;
