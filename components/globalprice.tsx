'use client';
import React, { useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Text,
  Flex,
  Image,
  VStack,
  HStack,
  useToast,
  Icon,
  StackDivider,
  IconButton,
} from '@chakra-ui/react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { BsCartX } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useGlobalCart } from '@/components/GlobalCartContext';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowBackIcon } from "@chakra-ui/icons";
import './globalprice.css';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface GlobalPriceProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalPrice: React.FC<GlobalPriceProps> = ({ isOpen, onClose }) => {
  const { globalCart, loadingCart, errorCart, updateCartItemQuantity, removeCartItem } = useGlobalCart();
  const toast = useToast();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const itemsWithStockInfo = Object.values(globalCart).map(item => ({
    ...item,
    availableStock: (item.stock || 0) - (item.stock_reduc || 0),
  }));
  const isCartInvalid = itemsWithStockInfo.some(item => item.availableStock < item.count);

  const totalPrice = itemsWithStockInfo.reduce((sum, item) => {
    const priceToUse = item.price_promo && item.price_promo > 0 ? item.price_promo : item.price;
    return sum + Number(priceToUse) * item.count;
  }, 0);

  const totalItems = itemsWithStockInfo.reduce((sum, item) => sum + item.count, 0);

  const handleCheckout = async () => {
    if (isCartInvalid) {
      toast({
        title: 'Articles en rupture de stock',
        description: 'Veuillez retirer les articles non disponibles de votre panier.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (totalItems === 0) {
      toast({
        title: 'Panier vide',
        description: 'Veuillez ajouter des articles à votre panier avant de passer à la caisse.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsCheckingOut(true);

    const items = Object.values(globalCart).map(item => ({
      _id: item._id,
      count: item.count,
      title: item.title,
      images: item.images,
    }));

    try {
      const response = await fetch('/api/stripe/checkout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { sessionId, message, error } = await response.json();

      if (!response.ok) {
        throw new Error(error || message || 'Failed to create checkout session.');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js has not loaded yet.');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      toast({
        title: 'Erreur de paiement',
        description: err.message || 'Une erreur est survenue lors de la redirection vers le paiement.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsCheckingOut(false);
    }
  };

  const handleRemoveClick = async (productId: string) => {
    try {
      await removeCartItem(productId);
      toast({
        title: 'Article supprimé',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || "Erreur lors de la suppression de l'article.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleIncreaseClick = async (item: any) => {
    const availableStock = (item.stock || 0) - (item.stock_reduc || 0);
    if (item.count + 1 > availableStock) {
        toast({
            title: 'Stock insuffisant',
            description: `Il ne reste que ${availableStock} exemplaire(s) disponible(s).`,
            status: 'warning',
            duration: 3000,
            isClosable: true,
        });
        return;
    }
    try {
      await updateCartItemQuantity(item._id, item.count + 1);
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || "Erreur lors de l'augmentation de la quantité.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDecreaseClick = async (productId: string, currentQuantity: number) => {
    try {
      if (currentQuantity - 1 === 0) {
        await removeCartItem(productId);
      } else {
        await updateCartItemQuantity(productId, currentQuantity - 1);
      }
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || "Erreur lors de la diminution de la quantité.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

return (
<Drawer isOpen={isOpen} placement="right" onClose={onClose} size={{ base: 'full', md: 'sm' }}>
  <DrawerOverlay bg="rgba(0, 0, 0, 0.4)" />
  <DrawerContent 
    borderTopLeftRadius="20px" 
    borderBottomLeftRadius="20px" 
    boxShadow="xl"
    bg="rgb(255, 246, 241)" 
  >
    {/* Flèche retour */}
    <IconButton
      aria-label="Retour"
      icon={<ArrowBackIcon boxSize={5} />}
      variant="ghost"
      colorScheme="#ff80b1"
      onClick={onClose}
      position="absolute"
      top="16px"
      left="16px"
      borderRadius="full"
      bg="white"
      _hover={{ bg: "#ff80b1.50" }}
      shadow="md"
    />
    
    {/* Header */}
    <DrawerHeader 
      borderBottomWidth="1px" 
      bg="whited" 
      fontWeight="bold" 
      fontSize="xl"
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      className="drawer-header"
    >
      🛒 ({totalItems})
    </DrawerHeader>

    {/* Body */}
    <DrawerBody p={4} overflowX="hidden" className="drawer-body">
      {loadingCart ? (
        <Flex align="center" justify="center" h="100%">
          <Text color="gray.500">Chargement...</Text>
        </Flex>
      ) : errorCart ? (
        <Flex align="center" justify="center" h="100%">
          <Text color="red.500">{errorCart}</Text>
        </Flex>
      ) : itemsWithStockInfo.length === 0 ? (
        <Flex direction="column" align="center" justify="center" h="100%" p={6}>
          <Icon as={BsCartX} boxSize="70px" color="gray.300" />
          <Text fontWeight="bold" mt={6} fontSize="xl">Votre panier est vide</Text>
          <Text mt={2} color="gray.500" textAlign="center">
            Les articles que vous ajoutez apparaîtront ici.
          </Text>
          <Button mt={6} colorScheme="#ff80b1" rounded="full" px={8} onClick={onClose}>
            Continuer mes achats
          </Button>
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {itemsWithStockInfo.map((item) => {
            const isOutOfStock = item.availableStock < item.count;
            return (
              <Flex
                key={item._id}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                bg="whited" 
                shadow="sm"
                _hover={{ shadow: "md" }}
                align="center"
                className="cart-item"
              >
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.title}
                  boxSize="80px"
                  borderRadius="md"
                  objectFit="cover"
                  mr={4}
                  className="cart-item-image"
                />
                <VStack align="start" spacing={1} flex={1} className="cart-item-details">
                  <Text fontWeight="semibold" noOfLines={2} className="cart-item-title">{item.title}</Text>
                  {item.price_promo ? (
                    <HStack>
                      <Text as="span" textDecoration="line-through" color="gray.400" fontSize="sm">
                        {Number(item.price).toFixed(2)}€
                      </Text>
                      <Text as="span" color="green.500" fontWeight="bold" className="cart-item-price">
                        {Number(item.price_promo).toFixed(2)}€
                      </Text>
                    </HStack>
                  ) : (
                    <Text fontWeight="bold" className="cart-item-price">{Number(item.price).toFixed(2)}€</Text>
                  )}
                  {isOutOfStock && (
                    <Text fontSize="xs" color="red.500" fontWeight="semibold">
                      Stock insuffisant ({item.availableStock} restants)
                    </Text>
                  )}
                </VStack>
                <VStack spacing={2}>
                  <HStack spacing={2}>
                    <IconButton size="sm" rounded="full" aria-label="Diminuer" icon={<FaMinus />} onClick={() => handleDecreaseClick(item._id, item.count)} isDisabled={item.count <= 1 || isOutOfStock} />
                    <Text fontWeight="bold">{item.count}</Text>
                    <IconButton size="sm" rounded="full" aria-label="Augmenter" icon={<FaPlus />} onClick={() => handleIncreaseClick(item)} isDisabled={isOutOfStock || item.count >= item.availableStock} />
                  </HStack>
                  <IconButton size="sm" variant="ghost" colorScheme="red" aria-label="Supprimer" icon={<FaTrash />} onClick={() => handleRemoveClick(item._id)} />
                </VStack>
              </Flex>
            )
          })}
        </VStack>
      )}
    </DrawerBody>

    {/* Footer */}
    {itemsWithStockInfo.length > 0 && (
      <DrawerFooter borderTopWidth="1px" bg="whited" className="drawer-footer">
        <VStack spacing={4} w="full">
          <Flex w="full" justify="space-between" fontWeight="semibold">
            <Text>Sous-total</Text>
            <Text fontSize="xl">{totalPrice.toFixed(2)}€</Text>
          </Flex>
          <Button
            colorScheme={isCartInvalid ? "red" : "white"}
            size="lg"
            bg="whited" 
            color={"#FF9800"}
            w="full"
            rounded="full"
            onClick={handleCheckout}
            isLoading={isCheckingOut}
            loadingText="Redirection..."
            isDisabled={isCheckingOut || isCartInvalid}
            className="checkout-button"
          >
            {isCartInvalid ? "Stock insuffisant" : "Passer la commande"}
          </Button>
        </VStack>
      </DrawerFooter>
    )}
  </DrawerContent>
</Drawer>
);

};

export default GlobalPrice;