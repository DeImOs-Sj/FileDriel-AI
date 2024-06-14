"use client"
import { ethers } from 'ethers';

import React from 'react'
import{useState } from "react"




const Connect = () => {
    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState("");
    console.log(walletAddress)
    
     const connectWallet = async function connectWallet() {
    
    if (!connected) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setConnected(true);
      setWalletAddress(_walletAddress);
    } else {
      // Disconnect the wallet
      window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
    }
     }
    
  return (
    <div>
      
          Connect  
          <button onClick={connectWallet}>Click me</button>    
          <h1 >{ walletAddress}</h1>
    </div>
  )
}

export default Connect
