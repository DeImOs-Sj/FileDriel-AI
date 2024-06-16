"use client"
import { ethers } from 'ethers';
import { Button } from "@/components/ui/button"

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
       <div>
      {!walletAddress ? (
        <Button type="button" className='rounded-full' onClick={connectWallet}>Wallet</Button>
      ) : (
        <Button type="button" className='rounded-full'>Connected</Button>
      )}
    </div>
    </div>
  )
}

export default Connect
