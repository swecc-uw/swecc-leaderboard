import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Center,
  Link as ChakraLink,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Member } from '../types';
import { useAuth } from '../hooks/useAuth';
import {
  FaInstagram,
  FaLinkedin,
  FaDiscord,
  FaGithub,
  FaEnvelope,
  FaGlobe,
} from 'react-icons/fa';
import {
  SWECC_INSTAGRAM_LINK,
  SWECC_LINKEDIN_LINK,
  SWECC_DISCORD_LINK,
  SWECC_GITHUB_LINK,
  SWECC_EMAIL_LINK,
  SWECC_WEBSITE_LINK,
} from '../constants';
import SWECC_LOGO from '../assets/transp-swecc-logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClose: () => void;
}

interface NavBarProps {
  member?: Member;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVerified: boolean;
}

const NO_REDIRECT_PATHS = ['/auth', '/join', '/leaderboard', '/'];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, member, isVerified } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const navBg = useColorModeValue('white', 'gray.900');

  useEffect(() => {
    if (
      !loading &&
      (!isAuthenticated || !isVerified) &&
      !NO_REDIRECT_PATHS.includes(pathname)
    ) {
      navigate('/auth');
    }
  }, [isAuthenticated, isVerified, loading, navigate, pathname]);

  if (loading) {
    return (
      <Center h="100vh" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Flex direction="column" minHeight="100vh" bg={bgColor}>
      <Box
        as="nav"
        bg={navBg}
        boxShadow="md"
        position="sticky"
        top={0}
        zIndex="sticky"
        transition="all 0.2s"
        _hover={{ boxShadow: 'lg' }}
      >
        <Container maxW="container.xl">
          <Navbar
            member={member}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            isVerified={isVerified}
          />
        </Container>
      </Box>

      <Box as="main" flexGrow={1} position="relative">
        <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            p={{ base: 4, md: 6 }}
            transition="all 0.2s"
            _hover={{ boxShadow: 'md' }}
          >
            {children}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

const Navbar: React.FC<NavBarProps> = ({
  isAuthenticated,
  isAdmin,
  isVerified,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonBg = 'green.700';
  const buttonColor = useColorModeValue('white', 'gray.800');

  const NavLinks = () => (
    <>
      {isAuthenticated && isVerified && (
        <NavLink onClose={onClose} to="/directory">
          Directory
        </NavLink>
      )}
      {isAdmin && isAuthenticated && (
        <NavLink onClose={onClose} to="/admin">
          Admin Dashboard
        </NavLink>
      )}

      {!isAuthenticated && (
        <>
          <Button
            as={Link}
            to="/join"
            colorScheme="green"
            size="md"
            h="36px"
            rounded={'md'}
            px={6}
            bg={buttonBg}
            color={buttonColor}
            onClick={onClose}
            _hover={{
              transform: 'translateY(-2px)',
              bg: 'green.600',
            }}
            transition="all 0.2s"
          >
            Join SWECC
          </Button>
          <NavLink onClose={onClose} to="/auth">
            Join the leaderboard
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <Flex justify="space-between" align="center" py={4} px={{ base: 4, md: 0 }}>
      <Link to="/">
        <ChakraLink
          as="span"
          display="flex"
          alignItems="center"
          onClick={onClose}
          position="relative"
          p={2}
          borderRadius="md"
          transition="all 0.2s"
          _hover={{
            textDecoration: 'none',
            bg: 'gray.200',
          }}
        >
          <Box
            position="relative"
            height="42px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <img
              src={SWECC_LOGO}
              alt="SWECC Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'brightness(0.6) contrast(1.5)',
              }}
            />
          </Box>
          <Text
            fontSize="45px"
            fontWeight="bold"
            fontFamily="monospace"
            ml={4}
            display={{ base: 'none', md: 'block' }}
          >
            <em>Leaderboard</em>
          </Text>
        </ChakraLink>
      </Link>
      <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
        <NavLinks />
      </HStack>

      <IconButton
        display={{ base: 'flex', md: 'none' }}
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
        variant="ghost"
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={4} mt={4}>
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClose }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Link to={to}>
      <ChakraLink
        as="span"
        fontWeight="medium"
        color={linkColor}
        _hover={{
          color: hoverColor,
          textDecoration: 'none',
        }}
        onClick={onClose}
        transition="color 0.2s"
      >
        {children}
      </ChakraLink>
    </Link>
  );
};

const Footer: React.FC = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const color = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('blue.500', 'blue.300');

  const socialLinks = [
    { icon: FaInstagram, href: SWECC_INSTAGRAM_LINK, label: 'Instagram' },
    { icon: FaLinkedin, href: SWECC_LINKEDIN_LINK, label: 'LinkedIn' },
    { icon: FaDiscord, href: SWECC_DISCORD_LINK, label: 'Discord' },
    { icon: FaGithub, href: SWECC_GITHUB_LINK, label: 'GitHub' },
    { icon: FaEnvelope, href: SWECC_EMAIL_LINK, label: 'Email' },
    { icon: FaGlobe, href: SWECC_WEBSITE_LINK, label: 'Website' },
  ];

  return (
    <Box
      as="footer"
      bg={bg}
      color={color}
      mt="auto"
      borderTopWidth="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" py={12}>
        <Flex direction="column" align="center">
          <HStack spacing={8} mb={8}>
            {socialLinks.map((link) => (
              <ChakraLink
                key={link.label}
                href={link.href}
                isExternal
                _hover={{
                  color: hoverColor,
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
                aria-label={link.label}
              >
                <link.icon size={24} />
              </ChakraLink>
            ))}
          </HStack>

          <Text textAlign="center" fontSize="sm" color={color}>
            © {new Date().getFullYear()} Software Engineering Career Club
            (SWECC). All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Layout;
