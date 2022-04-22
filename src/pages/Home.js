import React, { useEffect, useState } from 'react'
import '../App.css';
import {
  Image,
  Box,
  Text,
  Divider,
  Grid,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Stack
} from '@chakra-ui/react';
import meettheteam from "../assets/meet_the_team.png";
import Navbar from '../components/Navbar';
import merch1 from "../assets/merch/model_1.png";
import merch2 from "../assets/merch/model_2.png";
import merch3 from "../assets/merch/model_3.png";
import gen2 from "../assets/gen_2.jpg";
// import opensea from "../assets/opensea.svg";
import moment from "moment-timezone";
import Slider from "react-slick";
import Web3 from 'web3';
import config from "../config/config";
import azukiApe from "../contracts/AzukiApe.json";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import allowlist from "../config/allowlist";
import loader from "../assets/loader.svg";
import loaderWhite from "../assets/loader_white.svg";
import Footer from '../components/Footer';
import { Link } from "react-scroll";

const freeMintDate = moment.tz("2022-04-27 12:00", "Europe/London");
const whitelistMintDate = moment.tz("2022-04-27 16:00", "Europe/London");
const publicMintDate = moment.tz("2022-04-27 20:00", "Europe/London");

const Home = () => {
  const [web3, setWeb3] = useState({});
  const [address, setAddress] = useState('');
  const [mint, setMint] = useState(1);
  const [chainId, setChainId] = useState(1);
  const [merkle, setMerkle] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [txHash, setTxHash] = useState('');
  const [mintDone, setMintDone] = useState(false); 
  const [tokenIds, setTokenIds] = useState([]);
  const [countdown, setCountdown] = useState({});
  const [contract, setContract] = useState({}); 
  const [allowed, setAllowed] = useState(false);
  const toast = useToast();
  const [disableMint, setDisableMint] = useState(false);
  const [minted, setMinted] = useState(0);

  useEffect(()=>{
    const now = moment.tz(moment.now(), "Europe/London");
    if(now.isBefore(whitelistMintDate)) return;
    const eth = window.ethereum;
    const web3 = new Web3(eth);
    const wrapper = async () => {
      await eth.request({ method: 'eth_requestAccounts' });
    }
    wrapper().then(async ()=>{
      try {
        eth.on('accountsChanged', async (accounts) => {
          console.log(accounts);
        });
        eth.on('chainChanged', () => {
          window.location.reload();
        });
        setWeb3(web3);
        const chainId = await web3.eth.getChainId();
        setChainId(chainId);
        let addr;
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) addr = accounts[0];
        else if (Web3.utils.isAddress(accounts)) addr = accounts;
        setAddress(addr);
        const c = new web3.eth.Contract(azukiApe.abi, config[chainId].contract_address);
        setContract(c);
        const [t] = buildMerkleTree();
        const a = await c.methods.isAllowed(t.getHexProof(keccak256(addr)), addr).call({});
        setAllowed(a);
        await updateSupplyCounter(c);
      } catch(err) {
        console.log(err)
      }
    })
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const updateSupplyCounter = async (c) => {
    const s = await c.methods.totalSupply().call({});
    setMinted(s-1);
  }

  const buildMerkleTree = () => {
    const leaves = allowlist.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    })
    const root = tree.getRoot().toString('hex')
    console.log(root);
    setMerkle({ tree, root })
    return [tree, root];
  }

  function getProof(addr) {
    const {tree} = merkle;
    return tree.getHexProof(keccak256(addr));
  }

  const onMint = async () => {
    const amount = Web3.utils.fromDecimal(mint);
    setDisableMint(true);
    try {
      let price;
      const now = moment.tz(moment.now(), "Europe/London");
      if(now.isBefore(publicMintDate)) {
        price = await contract.methods.wlPrice().call({});
      } else {
        price = await contract.methods.price().call({});
      }
      const balance = await web3.eth.getBalance(address);
      const proof = getProof(address);
      if (balance < price * amount) {
        toast({
          title: 'Mint failed.',
          description: "Insufficient ETH",
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setDisableMint(false);
        updateSupplyCounter(contract);
        return;
      }
      const gas = await contract.methods.mint(amount, proof).estimateGas({
        from: address,
        value: price * amount,
      });
      contract.methods
        .mint(amount, proof)
        .send({
          from: address,
          gas: Math.floor(gas * 1.1),
          value: price * amount,
        })
        .on('receipt', (receipt) => {
          console.log(receipt);
          const trf = receipt.events.Transfer;
          if(Array.isArray(trf)) {
            setTokenIds(trf.map(v=>v.returnValues.tokenId))
          } else {
            setTokenIds([trf.returnValues.tokenId])
          }
          setMintDone(true);
          onOpen();
          setDisableMint(false);
          updateSupplyCounter(contract);
        })
        .on('transactionHash', (hash) => {
          setTxHash(hash);
          setMintDone(false);
          onOpen();
          setDisableMint(false);
          updateSupplyCounter(contract);
        })
        .on('error', (error) => {
          console.log(error)
          if(error.code === 4001) {
            toast({
              title: 'Mint cancelled.',
              description: 'Transaction rejected by user',
              status: 'error',
              duration: 2000,
              isClosable: true,
            });
            setDisableMint(false);
            updateSupplyCounter(contract);
            return;
          }
          toast({
            title: 'Mint failed.',
            description: error.message,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          setDisableMint(false);
          updateSupplyCounter(contract);
        });
    } catch (err) {
      if(err.code === -32603) {
        toast({
          title: 'Mint failed.',
          description: 'Insufficient funds',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        setDisableMint(false);
        updateSupplyCounter(contract);
        return;
      }
      toast({
        title: 'Mint failed.',
        description: err.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      setDisableMint(false);
      updateSupplyCounter(contract);
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

  const getCountdown = () => {
    const now = moment.tz(moment.now(), "Europe/London");
    let date;
    if(now.isBefore(freeMintDate)) {
      date = freeMintDate;
    } else if(now.isBefore(whitelistMintDate) && now.isAfter(freeMintDate)) {
      date = whitelistMintDate;
    } else {
      date = publicMintDate;
    }
    const diff = moment.duration(date.diff(now));
    return {
      days: diff.days(),
      hours: diff.hours(),
      minutes: diff.minutes(),
      seconds: diff.seconds(),
    };
  }

  const renderMintedItems = () => {
    const r = [];
    tokenIds.forEach(v=>{
      r.push(<Button colorScheme='red' width="100%" variant={"outline"} mb={4} onClick={()=>{
        window.open(`https://opensea.io/${config[chainId].contract_address}/${v}`)
      }}>
        Azuki Ape Social Club - #{v}
      </Button>)
    })
    return r;
  }

  const renderMintButton = () => {
    return <Box display="flex">
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
            let v = e.target.value;
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
          disabled={disableMint}
        >
         {disableMint?<Image src={loaderWhite} width="32px" height="32px" mr={4} ml={-2}/>:""} Mint Now for {mint * 375 / 10000} ETH
        </Button>
      </Box>
    </Box>
  }

  const renderMintContainer = () => {
    const now = moment.tz(moment.now(), "Europe/London");
    // return <Stack align="center">
    //   <Link to="avolve"
    //         smooth={true}
    //         offset={-100}
    //         style={{cursor:'pointer'}}
    //         onClick={onClose}>
    //   <Button
    //     variant="outline"
    //     size="lg"
    //     color="#B32033"
    //     className="heading"
    //     border='2px' borderColor='#B32033'
    //   >
    //     AASC GEN 2 Coming Soon
    //   </Button>
    //   </Link>
    // </Stack>;
    if(now.isBefore(freeMintDate)) {
      return <>
        <Text color="#171717" fontSize={"1rem"} className="heading">  
          AASC Gen 2 Minting In
        </Text>
        <Text mt={-2} color="#171717" fontSize={"2rem"} className="heading">  
          {getCountdown().days} days
        </Text>
      </>
    }
    if(now.isAfter(freeMintDate) && now.isBefore(whitelistMintDate)) {
      return <>
        <Text color="#171717" fontSize={"1rem"} className="heading">  
          Whitelist sale starts in {countdown.hours} hours {countdown.minutes} minutes {countdown.seconds} seconds
        </Text>
        {allowed?renderMintButton():<Text color="#171717" fontSize={"1.5rem"} className="heading">  
          You are not eliglible for free mint
        </Text>}
        <Text className='heading' float={"right"} fontSize={"sm"}> {minted} / 3333 </Text>
      </>
    }
    if(now.isAfter(whitelistMintDate) && now.isBefore(publicMintDate)) {
      return <>
        <Text color="#171717" fontSize={"1rem"} className="heading">  
          Public sale starts in {countdown.hours} hours {countdown.minutes} minutes {countdown.seconds} seconds
        </Text>
        {allowed?renderMintButton():<Text color="#171717" fontSize={"1.5rem"} className="heading">  
          You are not whitelisted
        </Text>}
        <Text className='heading' float={"right"} fontSize={"sm"}> {minted} / 3333 </Text>
      </>
    }
    return <>
      {renderMintButton()}
      <Text className='heading' float={"right"} fontSize={"sm"}> {minted} / 3333 </Text>
    </>
  }

  return (
    <>
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
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#171717">
        <ModalHeader className='heading' color={"white"} display="flex">{
          mintDone?"MINTED":<><Image src={loader} width="32px" height="32px" mr={4}/>Minting your azuki ape</>
        }</ModalHeader>
        <ModalCloseButton color={"white"} />
        <ModalBody color={"white"}>
          {mintDone?
          renderMintedItems()
          :
          <Button backgroundColor='#AF1D30' width="100%" mb={4} onClick={()=>window.open(`https://etherscan.io/tx/${txHash}`)}>
            View on Etherscan
          </Button>}
        </ModalBody>
      </ModalContent>
    </Modal>
      <Box
        backgroundColor="#EBE7DC"
        display={{base:"block",lg:"flex"}}
        justifyContent="space-between"
        alignItems="center"
        m={8}
        mx={{base:8, lg:64}}
        px={{base:4, lg:16}}
        py={{base:2, lg:4}}
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
        <Box mt={{base:8, lg:0}} px={{base:0, lg: 4}} width={{base:"100%", lg:"50%"}}>
          {renderMintContainer()}
        </Box>
        
      </Box>

      {/* Welcome */}
      <Box
        display={{base:"block",xl:"flex"}}
        justifyContent="space-between"
        alignItems="space-between"
        // m={8}
        ml={{base: 8, lg:32, xl: 64}}
        mr={{base: 8, lg:32, xl: 64}}
        mt={{base: 8, lg:12, xl: 32}}
      >
        <Box mr={{base: 0, lg:0, xl: 24}}>
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>Welcome to the Azuki Ape Social Club</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={1}
            mt={4}
          />
          <Text color="#ffffff" mt={8}>
          Welcome to the Azuki Ape Social Club (AASC). We are a membership only club of 3,333 Azuki Apes, with membership only accessible via the minting or purchasing of an Azuki Ape NFT. We are committed to creating an exclusive societal club that offers members various initial and long-term benefits, including merchandise, tangible and NFT based giveaways, access to Alpha WL projects, and exclusive access to future AASC generational mints. 
          <br/>
          <br/>
          We will never over promise or underdeliver to our members. We would rather under promise and over deliver, and that comes through the delivery of truth and openness. All of our aims and goals are achievable through the completion of a successful mint. It is important that we stress this from the outset. We are an open and honest team, looking to build an exclusive societal membership based on a shared affinity of NFT’s. No gimmicks. 
          </Text>
        </Box>
        <Box maxWidth={{base:"100%", lg:"100%", xl: "30%"}} mt={{base:4, lg:8, xl:0}} >
          <Grid templateColumns={{
            base:"repeat(2, 1fr)",
            lg:"repeat(4, 1fr)",
            xl:"repeat(2, 1fr)"
            }} gap={4} display="grid">
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

      {/* Avolving Ape */}
      <Box
        ml={{base: 8, lg: 32, xl:64}}
        mr={{base: 8, lg: 32, xl:64}}
        mt={{base: 8, lg: 12, xl:24}}
        id="avolve"
      >
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>Avolving Apes Social Club (AASC Gen 2)</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={1}
            mt={4}
          />
          <Box display={{base:"block",lg:"flex"}} justifyContent="space-between" alignContent="space-between">
            <Image
              height="100%"
              width={{base:"100%", lg:"35%"}}
              src={gen2}
              borderRadius={8}
              mt={8}
              objectFit="cover"
            />
          <Text color="#ffffff" mt={8} ml={{base:0, lg:8}}>
          Apes don't mutate, they Avolve… 
          <br/>
          <br/>

Soon, we will be launching the second arm of AASC in the form of Avolving Apes. This will take shape in the creation of a 3,333 collection of Avolving Apes which are essentially the Avolved neanderthal ancestors to the Azuki Apes. 
<br/>
<br/>

Whilst the Avolving Apes will share the same artistic integrity of the Azuki Apes, they will be a completely different species, comprising both new and old traits. Whilst the Azuki Apes were praised for their artistic brilliance, the Avolving Apes will showcase another level in aesthetic design.
          <br/>
          <br/>


Existing Azuki Ape holders will receive at least one free mint for the Avolving Apes, if they have either delisted their Azuki Ape(s) or listed them for at least 0.5 Ethereum. Please see the graphic below for further information. 
<br/>
<br/>

Follow our Twitter and Discord announcements for upcoming sneak peeks, and further insight into Gen 2. 
          </Text>
          
        </Box>
      </Box>


      {/* Roadmap */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="space-between"
        m={8}
        ml={{base: 8, lg: 32, xl:64}}
        mr={{base: 8, lg: 32, xl:64}}
        mt={{base: 8, lg: 12, xl:24}}
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
            <Text color="#ffffff" mb={8}>Please note, the below roadmap is ever changing in line with membership requests and input, as well as the highly evolving space in which we find ourselves in. Therefore, we are fluid in terms of the aims of the Azuki Ape Social Club, based on membership desires and the changing space. We are committed to ensuring our social club is inclusive and representative of the members within it, with equality and altruism playing a central role in our decision making</Text>
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
              Build the Azuki Ape Social Club Twitter page through organic growth. 
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
              Introduce the notion of AASC Gen 2 - Avolving Apes. Azuki Ape holders will be eligible for a free mint based on their holdings. At this stage, the development of Gen 2 will involve the creation of multiple new designs of Neanderthals, with various new traits, as well as old ones. Gen 2 will follow the same artistic integrity of Gen 1, and will be marketed using the same organic focus. 
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

          <Box mt={8}>
            <Text color="#ffffff" className="heading" fontSize={"2xl"}>Phase 4</Text>
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
              The apes will avolve… AASC Gen 2 comes to life - More to follow
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>


      {/* Merchandise */}
      <Box
        display={{base:"block",lg:"flex"}}
        justifyContent="space-between"
        alignItems="space-between"
        ml={{base: 8, lg: 32, xl:64}}
        mr={{base: 8, lg: 32, xl:64}}
        mt={{base: 8, lg: 12, xl:24}}
        id="merchandise"
      >
        <Box mr={{base: 0, lg:12, xl: 12}}>
          <Text color="#ffffff" className="heading" fontSize={"3xl"}>AASC Merchandise</Text>
          <Divider
            borderColor="blackAlpha.500"
            height={1}
            backgroundColor="#B32033"
            opacity={1}
            mt={4}
          />
          <Text color="#ffffff" mt={8}>
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


      {/* The Teams */}
      <Box
        display="block"
        justifyContent="space-between"
        alignItems="space-between"
        ml={{base: 8, lg: 32, xl:64}}
        mr={{base: 8, lg: 32, xl:64}}
        mt={{base: 8, lg: 12, xl:24}}
        pb={{base: 8, lg: 16, xl: 32}}
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
        <Box display="flex" alignItems="center" justifyContent="center" mt={8}>
          <Box maxWidth={{base:"720px", lg:"1080px"}}>
            <Image
              height="auto"
              width="auto"
              src={meettheteam}
              borderRadius={8}
            />
          </Box>
        </Box>
      </Box>
    </Box>
    <Footer/>
    </>
)
}

export default Home
