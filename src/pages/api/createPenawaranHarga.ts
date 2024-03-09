import type { NextApiRequest, NextApiResponse } from 'next';
import { BASE_URL } from '@/app/constant/constant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const endpoint = BASE_URL +'penawaran-harga/create';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        // If the API responds but not with a 2xx status code
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create Penawaran Harga');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
