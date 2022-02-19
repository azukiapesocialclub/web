import React, { useEffect, useState } from 'react'
import './App.css';
import {
  ChakraProvider,
  Image,
  Box,
  Text,
  Divider,
  Grid,
  Input,
  Button,
} from '@chakra-ui/react'
import bugsy from "./assets/bugsy.png"
import hook from "./assets/hook.png"
import kenji from "./assets/kenji.png"
import Navbar from './components/Navbar';
import merch1 from "./assets/merch/model_1.png";
import merch2 from "./assets/merch/model_2.png";
import merch3 from "./assets/merch/model_3.png";
// import opensea from "./assets/opensea.svg"
import moment from "moment-timezone";
import Slider from "react-slick";
import Web3 from 'web3';
import config from "./config/config";
import contract from "./contracts/AzukiApe.json";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import allowlist from "./config/allowlist";

const App = () => {
  const [web3, setWeb3] = useState({});
  const [address, setAddress] = useState('');
  const [mint, setMint] = useState(1);
  const [chainId, setChainId] = useState(1);
  const [merkle, setMerkle] = useState({});

  useEffect(()=>{
    const eth = window.ethereum;
    const web3 = new Web3(eth);
    const wrapper = async () => {
      await eth.request({ method: 'eth_requestAccounts' });
    }
    wrapper().then(async ()=>{
      eth.on('accountsChanged', async (accounts) => {
        console.log(accounts);
      });
      eth.on('chainChanged', () => {
        window.location.reload();
      });
      setWeb3(web3);
      const chainId = await web3.eth.getChainId();
      setChainId(chainId);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) setAddress(accounts[0]);
      else if (Web3.utils.isAddress(accounts)) setAddress(accounts);
    })
    buildMerkleTree();
  },[]);

  const buildMerkleTree = () => {
    const leaves = allowlist.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    })
    const root = tree.getRoot().toString('hex')
    console.log(root);
    setMerkle({ tree, root })
  }

  const isAllowed = (addr) => {
    const {tree, proof, root} = merkle;
    return tree.verify(proof, keccak256(addr), root);
  }

  function getProof(addr) {
    const {tree} = merkle;
    return tree.getHexProof(keccak256(addr));
  }

  const onMint = async () => {
    const c = new web3.eth.Contract(contract.abi, config[chainId].contract_address);
    const amount = Web3.utils.fromDecimal(mint);
    try {
      const price = await c.methods.price().call({});
      const balance = await web3.eth.getBalance(address);
      const proof = getProof(address);
      if (balance < price * amount) {
        // txtMint.textContent = 'Insufficient ETH';
        return;
      }
      const gas = await c.methods.mint(amount, proof).estimateGas({
        from: address,
        value: price * amount,
      });
      c.methods
        .mint(amount, proof)
        .send({
          from: address,
          gas: Math.floor(gas * 1.1),
          value: price * amount,
        })
        .on('receipt', (receipt) => {console.log(receipt)})
        .on('transactionHash', (hash) => {console.log(hash)})
        .on('error', (error) => {console.log(error)});
    } catch (err) {
      console.log(err);
    }
  }

  const changeMintNumber = (increment) => {
    if(increment) {
      if(mint >= 5) {
        return;
      }
      setMint(mint+1);
    } else {
      if(mint <= 1) {
        return;
      }
      setMint(mint-1);
    }
  }

  const whitelistMintDate = moment.tz("2022-02-26 15:30", "Europe/London")
  const publicMintDate = moment.tz("2022-02-27 15:30", "Europe/London")
  const getCountdown = (date) => {
    const now = moment.tz(moment.now(), "Europe/London");
    const target = moment.tz("2022-02-26 15:30", "Europe/London");
    const diff = moment.duration(target.diff(now));
    return {
      days: diff.days(),
      hours: diff.hours(),
      minutes: diff.minutes(),
      seconds: diff.seconds(),
    };
  }

  return (
  <ChakraProvider resetCSS>
    <Navbar/>
    <Box backgroundColor="#171717">
      <Box>
        <video width="100%" height="100%" controls muted autoPlay loop>
          <source src="./bg.mp4" type="video/mp4"/>
          <Image
          id="banner"
          height="100%"
          width="100%"
          src="https://pbs.twimg.com/profile_banners/1484206469285236736/1643465567/1500x500"
        />
        </video>
      </Box>
      <Box
        backgroundColor="#EBE7DC"
        display={{base:"block",lg:"flex"}}
        justifyContent="space-between"
        alignItems="center"
        m={8}
        mx={{base:8, lg:64}}
        px={{base:4, lg:16}}
        py={{base:2, lg:8}}
      >
        <Box width={{base:"100%", lg:"50%"}} >
          <Text color="#AF1D30" fontSize={"4vw"} className="heading">
            Join the Club
          </Text>
        </Box>
        <Divider
          borderColor="#B32033"
          orientation={{base: "vertical", lg:"horizontal"}}
          width={{base:"100%", lg: 1}}
          height={{base:1,lg:16}}
          backgroundColor="#B32033"
          color="#B32033"
        />
        {/* <Box mt={{base:2, lg:0}} px={{base:0, lg: 4}} width={{base:"100%", lg:"50%"}}>
          <Text color="#171717" fontSize={"1rem"} className="heading">  
            Minting In
          </Text>
          <Text mt={-2} color="#171717" fontSize={"2rem"} className="heading">  
            {getCountdown(whitelistMintDate).days} days {getCountdown(whitelistMintDate).hours} hours {getCountdown(whitelistMintDate).minutes} minutes
          </Text>
        </Box> */}

        <Box  mt={{base:8, lg:0}} px={{base:0, lg: 4}} width={{base:"100%", lg:"50%"}}>
            <Text color="#171717" fontSize={"1rem"} className="heading">  
              Public sale starts in {getCountdown(publicMintDate).hours} hours {getCountdown(publicMintDate).minutes} minutes {getCountdown(publicMintDate).seconds} seconds
            </Text>
          <Box display="flex">
            <Box display="flex" alignItems="center">
              <Box display="flex" pr={8}>
                <Button
                  variant="solid"
                  size="md"
                  backgroundColor="#B32033"
                  color="#fff"
                  className="heading"
                  onClick={()=>changeMintNumber(false)}
                >
                  -
                </Button>
                <Input backgroundColor="#fff" fontSize="sm" maxWidth="50%" value={mint} onChange={(e)=>{
                  const v = e.target.value;
                  if(v>5) v=5;
                  if(v<1) v=1;
                  setMint(v)
                }} type="number"/>
                <Button
                  variant="solid"
                  size="md"
                  color="#ffffff"
                  backgroundColor="#B32033"
                  className="heading"
                  onClick={()=>changeMintNumber(true)}
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
                px={{base:0, lg: 12}}
                onClick={onMint}
              >
                Mint Now
              </Button>
            </Box>
          </Box>
        </Box>
        
      </Box>
      <Box
        display={{base:"block",lg:"flex"}}
        justifyContent="space-between"
        alignItems="space-between"
        m={8}
        ml={{base: 8, lg:64}}
        mr={{base: 8, lg:64}}
        mt={{base: 8, lg:24}}
      >
        <Box>
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>Welcome to Azuki Ape Social Club</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={1}
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
        <Box maxWidth={{base:"100%",lg:"30%"}} mt={{base:4, lg:0}} >
          <Grid templateColumns="repeat(2, 1fr)" gap={4} display="grid">
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
        ml={{base: 8, lg:64}}
        mr={{base: 8, lg:64}}
        mt={{base: 8, lg:24}}
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
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" mt={4}>
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Build the Azuki Ape Social Club Twitter page through organic
              growth. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Provide ~333 Whitelist spots based on various criteria. We
              will provide further WL spots as we get closer to mint. Please
              note - This will not exceed 450 in total. 
              </Text>
            </Box>

            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Open access to the Discord for the public. 
              </Text>
            </Box>

            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Provide up to 10 NFT & Merch giveaways in the lead up to mint. 
              </Text>
            </Box>

            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              We will be providing FREE Azuki Ape Social Club T-Shirts for all 
              WL members after mint. At this stage, we will collect size information for these. 
              Please note, whilst these are free, WL members will need to cover shipping fees.
              </Text>
            </Box>
          </Box>
          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 2</Text>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" mt={4}>
              <Image
              mt={1}
              mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
                Launch the Azuki Ape Social Club with the initial ~333 early
                access private launch (WL). 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
                Launch the Azuki Ape Social Club in full with the remaining ~3,000 
                Azuki Apes via public sale. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Open up a private Discord channel whereby members of the Azuki Ape Social
              Club will have access to by connecting their wallets via Collab
              Land. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start">
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              The Azuki Ape Social Club will thereafter be able to be
              traded on secondary markets (OpenSea & LooksRare). Please note,
              selling/trading your Azuki Ape will thereby forfeit your
              membership to the Azuki Ape Social Club.
              </Text>
            </Box>
          </Box>
          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 3</Text>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" mt={4}>
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Future development funds will be generated with the intention to
              develop and expand the project through new proposals. These
              proposals will be driven by the membership of the Azuki Ape Social
              Club. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" >
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Develop an area for merchandise of AASC to be sold via the website.
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" >
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Kickstart monthly giveaways to Azuki Ape Social Club members - These will include gifts such as Playstations, Xbox’s, Iphones etc!
              </Text>
            </Box>
            
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" >
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Open discussions with the Azuki Ape Social Club pertaining to the 
              potential creation of an ERC-20 token that members could receive. 
              Utility from this token will be decided by the membership. 
              Initial thoughts include access to merchandise, passive income, 
              live events, or future mints of potential secondary collections. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" >
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Fulfil the delivery of the FREE Azuki Ape Social Club T-Shirts for 
              those WL members. 
              </Text>
            </Box>
            <Box display="flex" alignItems="stretch" justifyContent="flex-start" >
              <Image
                mt={1}
                mr={2}
                height={4}
                width={4}
                src="https://pbs.twimg.com/profile_images/1487429268921622531/woPzkzcQ_400x400.jpg"
                borderRadius={100}
              />
              <Text color="#ffffff">
              Deliver further exclusive benefits to societal members of the 
              Azuki Ape Social Club, including early access to future mints, 
              and WL spots for projects of interest.
              </Text>
          </Box>
        </Box>
      </Box>

      <Box
        display={{base:"block",lg:"flex"}}
        justifyContent="space-between"
        alignItems="space-between"
        m={8}
        ml={{base: 8, lg:64}}
        mr={{base: 8, lg:64}}
        mt={{base: 8, lg:24}}
        id="merchandise"
      >

      
        <Box>
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>AASC Merchandise</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={1}
            mt={4}
          />
          <Text color="#ffffff" maxWidth={480} mt={8}>
          As an exclusive societal club, we need to stand out. We want people to recognise our society and know that when they see our logo, they are looking at the most exclusive social club on the Blockchain. 

As a result of this desire, we will be launching our own merchandise for members to wear. Such merchandise will include this AASC T-Shirt which WL members will receive for FREE! 

Watch this space for more street wear inspired AASC merch!
          </Text>
        </Box>
        <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
        
        <Box maxWidth={{base:"100%",lg:"30%"}} mt={{base:4, lg:0}} ml={{base:0, lg:16}}>
          <Slider speed={500} slidesToShow={1} slidesToScroll={1} infinite={true} dots={true}>
            <Image
              height={256}
              width={256}
              src={merch1}
              borderRadius={8}
              objectFit="cover"
              backgroundColor={"white"}
            />
            <Image
              height={256}
              width={256}
              src={merch2}
              borderRadius={8}
              objectFit="cover"
              backgroundColor={"white"}
            />
            <Image
              height={256}
              width={256}
              src={merch3}
              borderRadius={8}
              objectFit="cover"
              backgroundColor={"white"}
            />
          </Slider>
          
        </Box>
      </Box>

      <Box
        display="block"
        justifyContent="space-between"
        alignItems="space-between"
        ml={{base: 8, lg:64}}
        mr={{base: 8, lg:64}}
        mt={{base: 8, lg:24}}
        pb={{base: 8, lg:32}}
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
        <Box display="flex" alignItems="flex-start" justifyContent="flex-start" mt={4}>
          <Box mr={4} maxWidth={{base:"72px", lg:"128px"}}>
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
          <Box mr={4} maxWidth={{base:"72px", lg:"128px"}}>
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
          <Box mr={4} maxWidth={{base:"72px", lg:"128px"}}>
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
}

export default App
