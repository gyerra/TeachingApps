import { fetchPrompts, deletePrompt } from '../../lib/supabaseClient';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const prompts = await fetchPrompts();
      res.status(200).json(prompts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      await deletePrompt(id);
      res.status(200).json({ message: 'Prompt deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
