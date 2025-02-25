import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('your_table_name')
    .select('*');

  if (error) {
    return res.status(500).json({ error: 'Error fetching data' });
  }

  res.status(200).json(data);
}
