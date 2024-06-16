import web3 from './web3';
import contract from './contract';

export async function runAgent(query: string, maxIterations: number, account: string): Promise<any> {
    const runId = await contract.methods.runAgent(query, maxIterations).send({ from: account });
    return runId;
}

export async function getMessageHistoryContents(agentId: number): Promise<string[]> {
    const messages: string[] = await contract.methods.getMessageHistoryContents(agentId).call();
    return messages;
}
