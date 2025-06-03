import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  useToast,
  Container,
  Image,
  Link,
  Icon,
} from '@chakra-ui/react';
import { FaTwitter, FaTiktok, FaTelegram, FaWallet } from 'react-icons/fa';
import { ethers } from 'ethers';

// Update these with your actual social media links and contract address
const SOCIAL_LINKS = {
  twitter: 'https://x.com/CashGrabbas999',      // Replace with your Twitter profile URL (e.g., 'https://twitter.com/MoonCoin')
  tiktok: 'https://tiktok.com/@yourcoin',       // Replace with your TikTok profile URL (e.g., 'https://tiktok.com/@mooncoin')
  telegram: 'https://t.me/cashgrabbas999'             // Replace with your Telegram group URL (e.g., 'https://t.me/MoonCoinOfficial')
};

const CONTRACT_ADDRESS = '0xYourContractAddressHere';  // Replace with your actual smart contract address (e.g., '0x123...abc')
const TOKEN_PRICE = '0.0001';                         // Price in ETH (e.g., '0.0001' means 1 ETH = 10000 tokens)

function App() {
  const toast = useToast();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: 'Metamask not found',
          description: 'Please install Metamask browser extension to continue',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const buyTokens = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: 'Metamask not found',
          description: 'Please install Metamask browser extension to continue',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create transaction
      const tx = {
        to: CONTRACT_ADDRESS,
        value: ethers.utils.parseEther(TOKEN_PRICE)
      };

      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();

      toast({
        title: 'Purchase Successful!',
        description: 'Your tokens will be sent to your wallet shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Purchase Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        bg="gray.900"
        color="white"
        py={20}
        backgroundImage="linear-gradient(to bottom right, #1a202c, #2d3748)"
      >
        <Container maxW="container.xl">
          <VStack spacing={10} align="center">
            {/* Hero Section */}
            <Box textAlign="center">
              <Heading
                size="2xl"
                bgGradient="linear(to-r, cyan.400, purple.500)"
                bgClip="text"
                mb={4}
              >
                🚀 CashGrabbas
              </Heading>
              <Box
                width="200px"
                height="200px"
                mb={6}
                mx="auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 'full',
                  background: 'linear-gradient(45deg, cyan.400, purple.500)',
                  filter: 'blur(15px)',
                  opacity: 0.3,
                  zIndex: 0,
                }}
              >
                <Image
                  src="/images/sealmoneyspread.png"
                  alt="MoonCoin Logo"
                  width="100%"
                  height="100%"
                  objectFit="contain"
                  borderRadius="full"
                  position="relative"
                  zIndex={1}
                />
              </Box>
              <Text fontSize="xl" mb={6}>
                $$$ Where the Real Breadwinners Wanna be! $$$
              </Text>
            </Box>

            {/* Buy Section */}
            <VStack spacing={4}>
              <Button
                colorScheme="purple"
                size="lg"
                leftIcon={<FaWallet />}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
              <Button
                colorScheme="cyan"
                size="lg"
                onClick={buyTokens}
              >
                Buy Tokens
              </Button>
              <Text fontSize="sm">
                1 ETH = {1/parseFloat(TOKEN_PRICE)} Tokens
              </Text>
            </VStack>

            {/* Social Links */}
            <HStack spacing={6}>
              <Link href={SOCIAL_LINKS.twitter} isExternal>
                <Icon as={FaTwitter} w={8} h={8} color="twitter.400" />
              </Link>
              <Link href={SOCIAL_LINKS.tiktok} isExternal>
                <Icon as={FaTiktok} w={8} h={8} color="white" />
              </Link>
              <Link href={SOCIAL_LINKS.telegram} isExternal>
                <Icon as={FaTelegram} w={8} h={8} color="telegram.400" />
              </Link>
            </HStack>

            {/* Features */}
            <Box textAlign="center" mt={10}>
              <Heading size="lg" mb={6}>
                Why Choose CashGrabbas? 🌟
              </Heading>
              <HStack spacing={8} wrap="wrap" justify="center">
                <Feature title="Community Driven" description="Built by the community, for the community" />
                <Feature title="Secure" description="Audited smart contract for your peace of mind" />
                <Feature title="Low Fees" description="Minimal transaction fees, maximum gains" />
              </HStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

function Feature({ title, description }) {
  return (
    <Box
      bg="whiteAlpha.100"
      p={6}
      rounded="lg"
      textAlign="center"
      backdropFilter="blur(10px)"
      minW="250px"
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text opacity={0.8}>{description}</Text>
    </Box>
  );
}

export default App; 