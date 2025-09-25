import { Flex, Heading, Text, Menu, MenuButton, MenuList, MenuItem, Button, Box } from "@chakra-ui/react";
import Link from 'next/link';
import { SmallAddIcon } from '@chakra-ui/icons'
import ProgressBar from './ProgressBar';
import { useGlobalCart } from '@/components/GlobalCartContext'; // Import useGlobalCart
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon

const Header = () => {
  const { globalCart, loadingCart, errorCart } = useGlobalCart(); // Use the global cart context

  // Calculate total items in cart
  const totalItemsInCart = Object.values(globalCart).reduce((total, item) => total + item.count, 0);

  return (
    <>
      <ProgressBar />
      <Flex p="2rem" direction="column">
        <Heading as='h1' size='4xl' marginLeft="7%" noOfLines={1} className="tasklist-title">
          Time
        </Heading>
        <Box position="absolute" top="2rem" right="2rem" zIndex={1000}>
          <Link href="/panier" passHref legacyBehavior>
            <Button as="a" variant="ghost" leftIcon={<FaShoppingCart />} isLoading={loadingCart}>
              {totalItemsInCart > 0 && (
                <Text ml={1} fontWeight="bold">
                  {totalItemsInCart}
                </Text>
              )}
            </Button>
          </Link>
        </Box>
        <div style={{ zIndex: 1000 }}>
        </div>
      </Flex>
    </>
  )
}

export default Header;
