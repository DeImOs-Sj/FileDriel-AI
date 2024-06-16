// pages/api/runAgent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { runAgent } from '../../utils/functions';

let agentRunCount = 0;  // Keep track of the agent run count

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, account } = req.body;
    const maxIterations = 10; 
    try {
        const runId = await runAgent(query, maxIterations, account);
        const agentId = agentRunCount;
        agentRunCount++;
        res.status(200).json({ agentId });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}
