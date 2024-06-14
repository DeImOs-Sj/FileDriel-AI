import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = provider.getSigner();

export const getContract = (contractAddress: string, abi: any) => {
    return new ethers.Contract(contractAddress, abi, signer);
};

export const connectWallet = async () => {
    await provider.send('eth_requestAccounts', []);
    return await  signer.getAddress();
};
