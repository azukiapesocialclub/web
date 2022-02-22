import React from 'react'
import './App.css';
import {
  ChakraProvider,
} from '@chakra-ui/react'
import Home from './pages/Home';

const App = () => {
  return (
  <ChakraProvider resetCSS>
    <Home/>
  </ChakraProvider>
)
}

export default App
