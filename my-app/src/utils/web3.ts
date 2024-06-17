import { ethers } from 'ethers';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

// Create the ethers provider using the window.ethereum object provided by MetaMask
const provider = new ethers.BrowserProvider(window.ethereum, 'any');

export default provider;
