import React from 'react'
import './App.css';
import {
  ChakraProvider,
  Stack,
  Avatar,
  AvatarBadge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Switch,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  Image,
  Box,
  Text,
  Divider,
  Grid,
  Button
} from '@chakra-ui/react'
import { EmailIcon, CopyIcon } from '@chakra-ui/icons'
import bugsy from "./assets/bugsy.png"
import hook from "./assets/hook.png"
import kenji from "./assets/kenji.png"
import {FaTwitter, FaDiscord} from 'react-icons/fa';
import opensea from "./assets/opensea.svg"

const App = () => (
  <ChakraProvider resetCSS>
    <Flex
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      textAlign="center"
      backgroundColor="#171717"
    >
      <Image
        height="48px"
        width="48px"
        src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
        borderRadius={100}
        ml={64}
        mt={2}
        mb={2}
        mr={4}
      />
      <Box display="flex" justifyContent="center" alignItems="center" ml={4}>
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
        <Box mr={64}>
          <a href='https://discord.gg/hxBx9y2urE' target="_blank" rel="noreferrer">
          <FaDiscord color="#ffffff" />
          </a>
        </Box>
        {/* <Box mr={64}>
          <a href='https://twitter.com/AzukiApeSC'>
          <Image src={opensea} height={4} width={4} />
          </a>
        </Box> */}
      </Box>
    </Flex>
    <Box backgroundColor="#171717">
      <Box>
        <Image
          height="100%"
          width="100%"
          src="https://pbs.twimg.com/profile_banners/1484206469285236736/1643465567/1500x500"
        />
      </Box>
      <Box
        backgroundColor="#EBE7DC"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        m={8}
        ml={64}
        mr={64}
        pl={24}
        pr={24}
        pt={8}
        pb={8}
      >
        <Box>
          <Text color="#AF1D30" fontSize={48} mr={16} className="heading">
            Join the Club
          </Text>
        </Box>
        <Divider
          borderColor="#B32033"
          orientation="horizontal"
          width={1}
          height={16}
          backgroundColor="#B32033"
          ml={4}
          mr={4}
          color="#B32033"
        />
        <Box display="flex">
          <Box display="flex" alignItems="center">
            <Box display="flex" pr={8}>
              <Button
                variant="solid"
                size="md"
                backgroundColor="#B32033"
                color="#fff"
                className="heading"
              >
                -
              </Button>
              <Input backgroundColor="#fff" fontSize="sm" maxWidth="50%" />
              <Button
                variant="solid"
                size="md"
                color="#ffffff"
                backgroundColor="#B32033"
                className="heading"
              >
                +
              </Button>
            </Box>
            <Button
              variant="solid"
              size="lg"
              backgroundColor="#B32033"
              color="#ffffff"
              className="heading"
            >
              Mint Now
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="space-between"
        m={8}
        ml={64}
        mr={64}
        mt={24}
      >
        <Box>
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>Welcome to Azuki Ape Social Club</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={0.92}
            mt={4}
          />
          <Text color="#ffffff" maxWidth={480} mt={8}>
            We are a membership only club of 3,333 Azuki Apes, with membership
            only accessible via the minting of an Azuki Ape NFT. We are
            committed to creating an exclusive societal club that offers members
            various initial and long-term benefits, including merchandise,
            access to Alpha WL projects, DAO access, and later with an ERC-20
            token that members can earn passive income with. Please note, this
            token will be dependent on the completion of mint
          </Text>
        </Box>
        <Box maxWidth="30%">
          <Grid templateColumns="repeat(2, 1fr)" gap={2} display="grid">
            <Image
              height="auto"
              width="auto"
              src="https://pbs.twimg.com/media/FLCAi6pXsAAXQtd?format=jpg&name=medium"
              borderRadius={8}
            />
            <Image
              height="auto"
              width="auto"
              src="https://pbs.twimg.com/media/FLCAi66WYAE3Iji?format=png&name=medium"
              borderRadius={8}
            />
            <Image
              height="auto"
              width="auto"
              src="https://pbs.twimg.com/media/FLMQ1omXIAE1-h9?format=jpg&name=medium"
              borderRadius={8}
            />
            <Image
              height="auto"
              width="auto"
              src="https://pbs.twimg.com/media/FLMQ1osXIAQWbLx?format=jpg&name=medium"
              borderRadius={8}
            />
          </Grid>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="space-between"
        m={8}
        ml={64}
        mr={64}
        mt={24}
      >
        <Box>
          <Text id="roadmap" color="#ffffff" className="heading" fontSize={"3xl"}>Roadmap</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={0.92}
            mt={4}
          />
          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 1</Text>
            <Text color="#ffffff" mt={4}>
              Build the Azuki Ape Social Club Twitter page through organic
              growth. Provide ~333 Whitelist spots based on various criteria. We
              will provide further WL spots as we get closer to mint. Please
              note - This will not exceed 450 in total. Open access to the
              Discord for the public. Provide up to 10 NFT & Merch giveaways in
              the lead up to mint. We will be providing FREE Azuki Ape Social
              Club T-Shirts for all WL members after mint. At this stage, we
              will collect size information for these. Please note, whilst these
              are free, WL members will need to cover shipping fees.
            </Text>
          </Box>
          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 2</Text>
            <Text color="#ffffff" mt={4}>
              Launch the Azuki Ape Social Club with the initial ~333 early
              access private launch (WL). Launch the Azuki Ape Social Club in
              full with the remaining ~3,000 Azuki Apes via public sale. Open up
              a private Discord channel whereby members of the Azuki Ape Social
              Club will have access to by connecting their wallets via Collab
              Land. The Azuki Ape Social Club will thereafter be able to be
              traded on secondary markets (OpenSea & LooksRare). Please note,
              selling/trading your Azuki Ape will thereby forfeit your
              membership to the Azuki Ape Social Club.
            </Text>
          </Box>
          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 3</Text>
            <Text color="#ffffff" mt={4}>
              Future development funds will be generated with the intention to
              develop and expand the project through new proposals. These
              proposals will be driven by the membership of the Azuki Ape Social
              Club. Develop an area for merchandise of AASC to be sold via the
              website. Kickstart monthly giveaways to Azuki Ape Social Club
              members - These will include gifts such as Playstations, Xbox’s,
              Iphones etc! Open discussions with the Azuki Ape Social Club
              pertaining to the potential creation of an ERC-20 token that
              members could receive. Utility from this token will be decided by
              the membership. Initial thoughts include access to merchandise,
              passive income, live events, or future mints of potential
              secondary collections. Fulfil the delivery of the FREE Azuki Ape
              Social Club T-Shirts for those WL members. Deliver further
              exclusive benefits to societal members of the Azuki Ape Social
              Club, including early access to future mints, and WL spots for
              projects of interest.
            </Text>
          </Box>
        </Box>
      </Box>
      <Box
        display="block"
        justifyContent="space-between"
        alignItems="space-between"
        ml={64}
        mr={64}
        mt={24}
        pb={32}
      >
        <Box>
          <Text id="team" color="#ffffff" className="heading" fontSize={"3xl"}>The Team</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={0.92}
            mt={4}
          />
          <Text color="#ffffff" mt={8}>
            AASC is a creation of three minds. These minds fused together two prodigious NFT collections into one remarkably exclusive social club.
          </Text>
        </Box>
        <Box display="flex" alignItems="flex-start" mt={8}>
          <Box mr={4} maxWidth="128px">
            <Image
              height="auto"
              width="auto"
              src={bugsy}
              borderRadius={8}
            />
            <Text color="#fff" fontSize="lg" fontWeight="bold" className="team-name">
              AASC | BUGSY
            </Text>
            <Text color="#fff" className="team-desc">INTO NFTS, APES, AND BLOCKCHAIN (AKA THE HOLY TRILOGY). </Text>
          </Box>
          <Box mr={4} maxWidth="128px">
            <Image
              height="auto"
              width="auto"
              src={hook}
              borderRadius={8}
            />
            <Text color="#fff" fontSize="lg" fontWeight="bold" className="team-name">
              AASC | HOOK
            </Text>
            <Text color="#fff" className="team-desc">
              GTA V BILLIONARE. HATES MUSHROOMS.
            </Text>
          </Box>
          <Box mr={4} maxWidth="128px">
            <Image
              height="auto"
              width="auto"
              src={kenji}
              borderRadius={8}
            />
            <Text color="#fff" fontSize="lg" fontWeight="bold" className="team-name">
              AASC | KENJI
            </Text>
            <Text color="#fff" className="team-desc">
              ALSO HATES MUSHROOMS.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  </ChakraProvider>
)

export default App
