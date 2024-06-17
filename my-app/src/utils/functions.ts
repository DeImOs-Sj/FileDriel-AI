import web3 from './web3';
import createContract from './contract';




export async function runAgent(query: string, maxIterations: number, account: string): Promise<any> {
    try {
        const contract = await createContract(); // Get the contract instance
        const transaction = await contract.runAgent(query, maxIterations);
        const receipt = await transaction.wait() 
        if (receipt.events && receipt.events.AgentRunCreated) {
            const event = receipt.events.AgentRunCreated;
            const runId = event.args.runId;
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
    const contract = await createContract(); // Get the contract instance
    const messages: string[] = await contract.getMessageHistoryContents(agentId);
    return messages;
}