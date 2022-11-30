import '../App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useContractEvent,
  useContractRead ,
  useSigner,
  useContract,
} from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { useEffect, useState } from 'react';
import { ConnectButton ,lightTheme} from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';

import SharedLayout from './sharedlayout';
import Home from './home';
import Market from './market.jsx';
import Myaccount from './myaccount';

const { chains, provider } = configureChains(
  [ chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})



function App() {
  const [activelink, setactivelink] = useState(undefined);

  useEffect(() => {
    setactivelink("0")
  }, []);
  
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact" theme={{
      lightMode: lightTheme(),
      // darkMode: darkTheme(),
       }} initialChain={chain.polygonMumbai}>


      <BrowserRouter >
      <Routes >
        <Route path='/' element={<SharedLayout setactivelink = {setactivelink} activelink = {activelink} />} >
          <Route index element={<Home />} />

          <Route path='myaccount' element={<Myaccount />} /> 
    
          <Route path='market' element={<Market  />} />

          <Route path='*' element={<Market />} />
        </Route>
      </Routes>
    </BrowserRouter>

      </RainbowKitProvider>
    </WagmiConfig>
    
  );
}

export default App;


// problems 1. dont play two matches against same player, win 1 and then withdraw it then play another, 
// as api verification can be manipulated by a loser submitting the match live with same opponent,
// where he won previously but latest match he lost.

// add timestamp so smae player vs opponent old chess link hasnt been submitted
