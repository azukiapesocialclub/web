import '../App.css';
import {
  Flex,
  Image,
  Box,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { Link } from "react-scroll";
import { FaTwitter, FaDiscord, FaBars, FaInstagram } from 'react-icons/fa';
import { useRef } from 'react';
import opensea from "../assets/opensea.svg";

const Navbar = () => {
    const [isDesktop] = useMediaQuery('(min-width: 62em)')

    const renderExpandedMenu = () => (
        <>
        <Box mr={8}>
        <Link 
            to="banner"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
            onClick={onClose}
        > 
        <Text color="#ffffff" className="heading navbar-item navbar-item-ltr">Home</Text>
        </Link>
        </Box>
        <Box mr={8}>
        <Link 
            to="roadmap"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
        > 
        <Text color="#ffffff" className="heading navbar-item navbar-item-ltr">Roadmap</Text>
        </Link>
        </Box>
        <Box mr={8}>
        <Link 
            to="merchandise"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
        > 
        <Text color="#ffffff" className="heading navbar-item navbar-item-ltr">Merchandise</Text>
        </Link>
        </Box>
        <Box mr={16}>
        <Link 
            to="team"
            smooth={true}
            offset={-40}
            style={{cursor:'pointer'}}
        > 
            <Text color="#ffffff" className="heading navbar-item navbar-item-ltr">Team</Text>
        </Link>
        </Box>
        <Box mr={4}>
        <a href='https://twitter.com/AzukiApeSC' target="_blank" rel="noreferrer">
            <FaTwitter color="#ffffff" />
        </a>
        </Box>
        <Box mr={4}>
        <a href='https://www.instagram.com/azukiapesocialclub' target="_blank" rel="noreferrer">
            <FaInstagram color="#ffffff" />
        </a>
        </Box>
        <Box mr={4}>
        <a href='https://discord.gg/hxBx9y2urE' target="_blank" rel="noreferrer">
        <FaDiscord color="#ffffff" />
        </a>
        </Box>
            <Box mr={{base: 0, lg:64}}>
            <a href='https://opensea.io/collection/azukiapesocialclub' target="_blank" rel="noreferrer">
                <Image src={opensea} width={4}/>
            </a>
            </Box>
        </>
    );
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef();

    const renderCollapsedMenu = () => (
        <>
            <Box mr={{base: 16, lg:64}}>
                <button onClick={onOpen} ref={btnRef}>
                    <FaBars color="#ffffff" />
                </button>
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
        <Link 
            to="banner"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
            onClick={onClose}
        > 
        <Image
            height="48px"
            width="48px"
            src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
            borderRadius={100}
            ml={2}
            mt={4}
        />
        </Link>
        <Box mr={8}>
        <Link 
            to="banner"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
            onClick={onClose}
        > 
        <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Home</Text>
        </Link>
        </Box>
        <Box mr={8} mt={4}>
        <Link 
            to="roadmap"
            smooth={true}
            offset={-40}
            style={{cursor:'pointer'}}
            onClick={onClose}
        > 
        <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Roadmap</Text>
        </Link>
        </Box>
        <Box mr={8}>
        <Link 
            to="merchandise"
            smooth={true}
            offset={-100}
            style={{cursor:'pointer'}}
        > 
        <Text color="#ffffff" className="heading navbar-item navbar-item-ltr">Merchandise</Text>
        </Link>
        </Box>
        <Box mr={16}>
        <Link 
            to="team"
            smooth={true}
            offset={-40}
            style={{cursor:'pointer'}}
            onClick={onClose}
        > 
            <Text color="#ffffff" className="heading" fontSize={36} mt={4} ml={4}>Team</Text>
        </Link>
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
            <Box ml={4}>
            <a href='https://www.instagram.com/azukiapesocialclub' target="_blank" rel="noreferrer">
            <FaInstagram  fontSize={24} color="#ffffff" />
            </a>
            </Box>
            <Box ml={4}>
            <a href='https://opensea.io/collection/azukiapesocialclub' target="_blank" rel="noreferrer">
                <Image src={opensea} width={6}/>
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
            position={{base:"sticky", lg:"fixed"}}
            top={0}
            zIndex={999}
            >
            <Link 
                to="banner"
                smooth={true}
                offset={-100}
                style={{cursor:'pointer'}}
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
                </Link>
           
            {/* {renderExpandedMenu()} */}
        <Box display="flex" justifyContent="center" alignItems="center">
            {isDesktop?renderExpandedMenu():renderCollapsedMenu()}
        </Box>
        </Flex>
    )
}

export default Navbar;
