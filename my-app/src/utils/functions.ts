import Web3 from "web3";
import { address, Abi } from "./contract";

let web3: Web3 | undefined;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
}

export async function runAgent(query: string, maxIterations: number) {
  try {
    if (!web3) {
      throw new Error("Web3 provider not available");
    }

    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const contract = new web3.eth.Contract(Abi, address);

    const result = await contract.methods
      .runAgent(query, maxIterations)
      .send({ from: account });

    console.log("Agent run started successfully:", result);
  } catch (error: any) {
    console.error("Error running agent:", error.message);
  }
}

export async function getMessageHistoryContents(agentId: number) {
  console.log(agentId);
  try {
    if (!web3) {
      throw new Error("Web3 provider not available");
    }

    const contract = new web3.eth.Contract(Abi, address);
    const messages = await contract.methods
      .getMessageHistoryContents(agentId)
      .call();
    return messages;
  } catch (error: any) {
    console.error("Error getting message history contents:", error.message);
  }
}
