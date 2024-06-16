import { NextApiRequest, NextApiResponse } from 'next';
import { getMessageHistoryContents } from '../../utils/functions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { agentId } = req.query;
    try {
        const messages = await getMessageHistoryContents(Number(agentId));
        res.status(200).json({ messages });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
}
