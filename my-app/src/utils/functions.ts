import web3 from './web3';
import contract from './contract';

export async function runAgent(query: string, maxIterations: number, account: string): Promise<any> {
    try {
        const receipt = await contract.methods.runAgent(query, maxIterations).send({ from: account });
        if (receipt.events && receipt.events.AgentRunCreated) {
            const event = receipt.events.AgentRunCreated;
            const runId = event.returnValues.runId;
            return runId;
        } else {
            throw new Error('Event AgentRunCreated not found in transaction receipt');
        }
    } catch (error) {
        console.error('Error running agent:', error);
        throw error;
    }
}


export async function getMessageHistoryContents(agentId: number): Promise<string[]> {
    const messages: string[] = await contract.methods.getMessageHistoryContents(agentId).call();
    return messages;
}
