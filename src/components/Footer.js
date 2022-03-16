import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
    Image
  } from '@chakra-ui/react';
  import { FaInstagram, FaTwitter, FaDiscord } from 'react-icons/fa';
  import opensea from "../assets/opensea.svg";
  
  const SocialButton = ({
    children,
    label,
    href,
  }) => {
    return (
      <chakra.button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };
  
  export default function Footer() {
    return (
      <Box
        bg={"#202020"}
        color={'gray.50'}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          mx={24}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          
        <Image
            height="48px"
            width="48px"
            src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
            borderRadius={100}
            ml={{base:8, lg: 24}}
            
            my={2}
            mr={4}
        />

          <Text>© 2022 Azuki Ape Social Club. All rights reserved</Text>
          <Stack direction={'row'} mr={{base:8, lg: 48}} mb={4}>
            <SocialButton label={'Twitter'} href={'https://twitter.com/AzukiApeSC'} target="_blank" rel="noreferrer">
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'Instagram'} href='https://www.instagram.com/azukiapesocialclub' target="_blank" rel="noreferrer">
              <FaInstagram />
            </SocialButton>
            <SocialButton label={'Discord'} href='https://discord.gg/hxBx9y2urE' target="_blank" rel="noreferrer">
              <FaDiscord />
            </SocialButton>
            <SocialButton label={'Opensea'} href='https://www.instagram.com/azukiapesocialclub' target="_blank" rel="noreferrer">
                <Image src={opensea} width={4}/>
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    );
  }