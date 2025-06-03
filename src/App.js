import React, { useEffect, useState } from 'react';
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaTwitter, FaTiktok, FaTelegram, FaWallet, FaMobile, FaDesktop } from 'react-icons/fa';
import { ethers } from 'ethers';

// Update these with your actual social media links and contract address
const SOCIAL_LINKS = {
  twitter: 'https://x.com/CashGrabbas999',      // Replace with your Twitter profile URL (e.g., 'https://twitter.com/MoonCoin')
  tiktok: 'https://tiktok.com/@cashgrabbas999',       // Replace with your TikTok profile URL (e.g., 'https://tiktok.com/@mooncoin')
  telegram: 'https://t.me/cashgrabbas999'             // Replace with your Telegram group URL (e.g., 'https://t.me/MoonCoinOfficial')
};

const CONTRACT_ADDRESS = '0xYourContractAddressHere';  // Replace with your actual smart contract address (e.g., '0x123...abc')
const TOKEN_PRICE = '0.0001';                         // Price in ETH (e.g., '0.0001' means 1 ETH = 10000 tokens)

function MetaMaskAlert({ isMobile }) {
  if (isMobile) {
    return (
      <Alert status="info" borderRadius="md" mb={4}>
        <AlertIcon />
        <Box>
          <AlertTitle>Mobile Device Detected</AlertTitle>
          <AlertDescription>
            To use CashGrabbas on mobile:
            <VStack align="start" mt={2} spacing={2}>
              <Text>1. Install MetaMask from your app store</Text>
              <Text>2. Open this website using MetaMask's built-in browser</Text>
              <Link
                href="https://metamask.io/download/"
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                Download MetaMask Mobile
              </Link>
            </VStack>
          </AlertDescription>
        </Box>
      </Alert>
    );
  }
  
  return (
    <Alert status="warning" borderRadius="md" mb={4}>
      <AlertIcon />
      <Box>
        <AlertTitle>MetaMask Required</AlertTitle>
        <AlertDescription>
          To interact with CashGrabbas:
          <VStack align="start" mt={2} spacing={2}>
            <Text>1. Install the MetaMask browser extension</Text>
            <Text>2. Create or import a wallet</Text>
            <Text>3. Connect your wallet to this site</Text>
            <Link
              href="https://metamask.io/download/"
              isExternal
              color="blue.500"
              textDecoration="underline"
            >
              Install MetaMask Extension
            </Link>
          </VStack>
        </AlertDescription>
      </Box>
    </Alert>
  );
}

function App() {
  const toast = useToast();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    if (typeof window !== 'undefined') {
      setIsMetaMaskInstalled(!!window.ethereum);
    }
  }, []);

  const getMetaMaskInstructions = () => {
    if (isMobile) {
      return (
        <Alert status="info" borderRadius="md" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>Mobile Device Detected</AlertTitle>
            <AlertDescription>
              To use CashGrabbas on mobile:
              <VStack align="start" mt={2} spacing={2}>
                <Text>1. Install MetaMask from your app store</Text>
                <Text>2. Open this website using MetaMask's built-in browser</Text>
                <Link
                  href="https://metamask.io/download/"
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  Download MetaMask Mobile
                </Link>
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      );
    }
    
    if (!isMetaMaskInstalled) {
      return (
        <Alert status="warning" borderRadius="md" mb={4}>
          <AlertIcon />
          <Box>
            <AlertTitle>MetaMask Required</AlertTitle>
            <AlertDescription>
              To interact with CashGrabbas:
              <VStack align="start" mt={2} spacing={2}>
                <Text>1. Install the MetaMask browser extension</Text>
                <Text>2. Create or import a wallet</Text>
                <Text>3. Connect your wallet to this site</Text>
                <Link
                  href="https://metamask.io/download/"
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  Install MetaMask Extension
                </Link>
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      );
    }
    
    return null;
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        const message = isMobile
          ? 'Please open this site using the MetaMask app browser'
          : 'Please install MetaMask browser extension to continue';
          
        toast({
          title: 'MetaMask Not Found',
          description: message,
          status: 'warning',
          duration: 10000,
          isClosable: true,
        });
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setIsMetaMaskConnected(true);
        toast({
          title: 'Wallet Connected',
          description: `Connected with address: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'You rejected the connection request. Please try again.';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is already processing a connection request. Please check your MetaMask extension.';
      }
      
      toast({
        title: 'Connection Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const buyTokens = async () => {
    try {
      if (typeof window === 'undefined') return;

      if (!window.ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: isMobile
            ? 'Please open this site using the MetaMask app browser'
            : 'Please install the MetaMask browser extension to continue',
          status: 'warning',
          duration: 10000,
          isClosable: true,
        });
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Check if we're connected first
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        await connectWallet();
        return;
      }

      const signer = provider.getSigner();
      
      // Check network
      const network = await provider.getNetwork();
      if (network.chainId !== 1) { // 1 is Ethereum Mainnet
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Ethereum Mainnet in MetaMask',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Create transaction
      const tx = {
        to: CONTRACT_ADDRESS,
        value: ethers.utils.parseEther(TOKEN_PRICE)
      };

      const transaction = await signer.sendTransaction(tx);
      
      toast({
        title: 'Transaction Submitted',
        description: 'Please wait while your transaction is being processed...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      await transaction.wait();

      toast({
        title: 'Purchase Successful!',
        description: 'Your tokens will be sent to your wallet shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      let errorMessage = 'Failed to complete purchase';
      
      if (error.code === 4001) {
        errorMessage = 'You rejected the transaction. Please try again.';
      } else if (error.code === -32603) {
        errorMessage = 'Insufficient funds for gas fee and token purchase.';
      }
      
      toast({
        title: 'Purchase Error',
        description: errorMessage,
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
            {/* Show MetaMask alert if not installed */}
            {!isMetaMaskInstalled && <MetaMaskAlert isMobile={isMobile} />}

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
                isDisabled={!isMetaMaskInstalled}
              >
                {isMetaMaskConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </Button>
              <Button
                colorScheme="cyan"
                size="lg"
                onClick={buyTokens}
                isDisabled={!isMetaMaskInstalled || !isMetaMaskConnected}
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