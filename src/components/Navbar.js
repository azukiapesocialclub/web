import '../App.css';
import {
  Flex,
  Image,
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  Button,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import {FaTwitter, FaDiscord, FaBars} from 'react-icons/fa';
import { useRef } from 'react';

const Navbar = () => {
    const [isDesktop] = useMediaQuery('(min-width: 62em)')
    const renderExpandedMenu = () => (
        <>
        <Box mr={8}>
        <a href='#'>
        <Text color="#ffffff" className="heading">Home</Text>
        </a>
        </Box>
        <Box mr={8}>
        <a href='#roadmap'>
        <Text color="#ffffff" className="heading">Roadmap</Text>
        </a>
        </Box>
        <Box mr={16}>
        <a href='#team'>
        <Text color="#ffffff" className="heading">Team</Text>
        </a>
        </Box>
        <Box mr={4}>
        <a href='https://twitter.com/AzukiApeSC' target="_blank" rel="noreferrer">
            <FaTwitter color="#ffffff" />
        </a>
        </Box>
        <Box mr={{base: 0, lg:64}}>
        <a href='https://discord.gg/hxBx9y2urE' target="_blank" rel="noreferrer">
        <FaDiscord color="#ffffff" />
        </a>
        </Box>
        </>
    );
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

    const renderCollapsedMenu = () => (
        <>
            <Box mr={{base: 16, lg:64}}>
            <a onClick={onOpen}  ref={btnRef}>
            <FaBars color="#ffffff" />
            </a>
            </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody
                backgroundColor="#171717"
        >
        <Image
            height="48px"
            width="48px"
            src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
            borderRadius={100}
            ml={2}
            mt={4}
        />
        <Box mr={8}>
        <a href='#'>
        <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Home</Text>
        </a>
        </Box>
        <Box mr={8} mt={4}>
        <a href='#roadmap'>
        <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Roadmap</Text>
        </a>
        </Box>
        <Box mr={16}>
        <a href='#team'>
        <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Team</Text>
        </a>
        </Box>
        <Box mt={8} ml={4} display="flex" justifyContent="flex-start" alignItems="center">
            <Box >
            <a href='https://twitter.com/AzukiApeSC' target="_blank" rel="noreferrer">
                <FaTwitter fontSize={24} color="#ffffff" />
            </a>
            </Box>
            <Box ml={4}>
            <a href='https://discord.gg/hxBx9y2urE' target="_blank" rel="noreferrer">
            <FaDiscord  fontSize={24} color="#ffffff" />
            </a>
            </Box>
        </Box>
        
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </>
    )

    return (
        <Flex
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            textAlign="center"
            backgroundColor="#171717"
            width="100%"
            >
            <Image
                height="48px"
                width="48px"
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
                ml={{base:8, lg: 64}}
                
                mb={2}
                mr={4}
                mt={2}
            />
            {/* {renderExpandedMenu()} */}
        <Box display="flex" justifyContent="center" alignItems="center">
            {isDesktop?renderExpandedMenu():renderCollapsedMenu()}
        </Box>
        </Flex>
    )
}

export default Navbar;
