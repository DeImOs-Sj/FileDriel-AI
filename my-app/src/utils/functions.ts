import { address, Abi } from "./contract";
import Web3 from "web3";

export async function runAgent(query: string, maxIterations: number) {
  const web3 = window.web3;
  const contract = new web3.eth.Contract(Abi, address);

  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const result = await contract.methods
      .runAgent(query, maxIterations)
      .send({ from: account });

    console.log("Agent run started successfully:", result);
  } catch (error: any) {
    console.error("Error running agent:", error.message);
  }
}

export async function getMessageHistoryContents(agentId: number) {
  // if (window.ethereum) {
  //   window.web3 = new Web3(window.ethereum);
  //   await window.ethereum.enable();
  // } else if (window.web3) {
  //   window.web3 = new Web3(window.web3.currentProvider);
  // } else {
  //   console.log(
  //     "Non-Ethereum browser detected. You should consider trying MetaMask!"
  //   );
  //   return;
  // }
  const web3 = window.web3;
  const contract = new web3.eth.Contract(Abi, address);
  try {
    const messages = await contract.methods
      .getMessageHistoryContents(agentId)
      .call();
    return messages;
  } catch (error: any) {
    console.error("Error getting message history contents:", error.message);
  }
}
