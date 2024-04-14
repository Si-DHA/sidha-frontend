import { BASE_URL } from '@/app/constant/constant';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { klienId } = req.query;

  if (req.method === 'GET' && klienId) {
    try {
      const endpoint = BASE_URL + `/order/klien/${klienId}/view-all`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ message: errorData.message || 'Failed to get order' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
