import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button, Text, Image
} from "@chakra-ui/react";
import loader from "../assets/loader.svg";

const CustomModal = ({
    message, tokenIds, contractAddress, mintDone, txHash,
    isOpen, onOpen, onClose
}) => {
    const renderMintedItems = () => {
      const r = [];
      tokenIds.forEach(v=>{
        r.push(<Button colorScheme='red' width="100%" variant={"outline"} mb={4} onClick={()=>{
          window.open(`https://opensea.io/${contractAddress}/${v}`)
        }}>
          Azuki Ape Social Club - #{v}
        </Button>)
      })
      return r;
    }
    const renderTxButton = () => {
      return <Button backgroundColor='#AF1D30' width="100%" mb={4} onClick={()=>window.open(`https://etherscan.io/tx/${txHash}`)}>
        View on Etherscan
      </Button>;
    }
    const renderMessage = () => {
      return <Text color={"white"}>
        {message}
      </Text>;
    }
    const renderModalContent = () => {
        if(message) return renderMessage();
      if(mintDone) return renderMintedItems();
      return renderTxButton();
    }
    return <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#171717">
        <ModalHeader className='heading' color={"white"} display="flex">{
          mintDone?"MINTED":<><Image src={loader} width="32px" height="32px" mr={4}/>Minting your azuki ape</>
        }</ModalHeader>
        <ModalCloseButton color={"white"} />
        <ModalBody color={"white"}>
          {renderModalContent()}
        </ModalBody>
      </ModalContent>
    </Modal>;
}

export default CustomModal;